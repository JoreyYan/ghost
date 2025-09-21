-- 在 Supabase 控制台中执行此 SQL 来添加缺失的列

-- 添加 description 列
ALTER TABLE sources ADD COLUMN IF NOT EXISTS description TEXT;

-- 添加 ai_focus 列  
ALTER TABLE sources ADD COLUMN IF NOT EXISTS ai_focus TEXT;

-- 验证列已添加
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sources' 
ORDER BY ordinal_position;
