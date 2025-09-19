-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Categories table (hierarchical categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data sources table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind TEXT CHECK (kind IN ('rss','github_user','github_repo','json','html')),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  fetch_cron TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (kind, handle)
);

-- Source-Category many-to-many relationship
CREATE TABLE source_categories (
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (source_id, category_id)
);

-- Analysis policies (versioned, reusable)
CREATE TABLE analysis_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  version INT NOT NULL DEFAULT 1,
  policy JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atomic content items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id),
  url TEXT NOT NULL,
  title TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  content TEXT,
  raw_ref TEXT,
  content_sha TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (source_id, url)
);

-- Vector embeddings for semantic search
CREATE TABLE item_embeddings (
  item_id UUID PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  embedding VECTOR(1536),
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily digests
CREATE TABLE daily_digests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id),
  date DATE NOT NULL,
  summary_md TEXT,
  insights_md TEXT,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (source_id, date)
);

-- Fetch run logs
CREATE TABLE fetch_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  ok BOOLEAN,
  new_items INT DEFAULT 0,
  error TEXT
);

-- Entities (people/organizations/projects)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('person','organization','project')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entity links
CREATE TABLE entity_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id),
  source_id UUID REFERENCES sources(id),
  source_identifier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_items_source_id ON items(source_id);
CREATE INDEX idx_items_published_at ON items(published_at);
CREATE INDEX idx_items_content_sha ON items(content_sha);
CREATE INDEX idx_daily_digests_source_date ON daily_digests(source_id, date);
CREATE INDEX idx_fetch_runs_source_started ON fetch_runs(source_id, started_at);

-- Create vector index for semantic search
CREATE INDEX ON item_embeddings USING hnsw (embedding vector_cosine_ops);

-- Insert default categories
INSERT INTO categories (name) VALUES 
  ('Financial'),
  ('Bio-AI'),
  ('Industry'),
  ('Research'),
  ('Technology');

-- Insert default analysis policy
INSERT INTO analysis_policies (name, policy) VALUES (
  'default',
  '{
    "summary": {
      "target_length": 150,
      "language": "Chinese",
      "style": "concise",
      "require_citations": true
    },
    "insights": {
      "trends": true,
      "impact": true,
      "risks": true,
      "opportunities": true
    },
    "extraction": {
      "financial": ["round", "amount", "currency", "lead_investors", "valuation"],
      "bio_ai": ["task", "dataset", "metric", "score", "model", "params", "license"],
      "industry": ["vendor", "product", "standard", "region", "partner"]
    },
    "actions": {
      "count": 3,
      "template": "Research-focused actionable items"
    }
  }'::jsonb
);
