-- 为 sources 表添加更多配置字段，实现标准化的内容提取和去重

-- 1. 添加内容提取章节字段（简化版本）
ALTER TABLE sources
ADD COLUMN IF NOT EXISTS extract_section TEXT DEFAULT '';

-- 2. 添加去重策略字段
ALTER TABLE sources
ADD COLUMN IF NOT EXISTS dedup_strategy TEXT DEFAULT 'content_hash';

-- 示例：为 GitHub README 源配置提取规则
-- UPDATE sources
-- SET 
--   extract_section = 'Papers last week',
--   dedup_strategy = 'section_hash'
-- WHERE handle LIKE '%github.com%' AND kind = 'github_repo';

COMMENT ON COLUMN sources.extract_section IS '只关注特定章节，例如: Papers last week, Latest Updates';
COMMENT ON COLUMN sources.dedup_strategy IS '去重策略：content_hash=内容哈希, section_hash=章节哈希, none=不去重';
