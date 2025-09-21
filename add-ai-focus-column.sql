-- 添加 ai_focus 列到 sources 表
ALTER TABLE sources ADD COLUMN IF NOT EXISTS ai_focus TEXT;

-- 添加 description 列到 sources 表（如果不存在）
ALTER TABLE sources ADD COLUMN IF NOT EXISTS description TEXT;

-- 查看表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sources' 
ORDER BY ordinal_position;
