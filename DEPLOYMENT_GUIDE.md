# 部署指南：Vercel + Supabase

## 第一步：设置 Supabase 项目

### 1. 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择组织（或创建新的）
5. 填写项目信息：
   - **Name**: `news-intelligence`
   - **Database Password**: 生成一个强密码（保存好）
   - **Region**: 选择离你最近的地区（建议 US East 或 US West）
6. 点击 "Create new project"
7. 等待项目创建完成（约 2-3 分钟）

### 2. 获取 Supabase 配置信息
1. 进入项目后，点击左侧菜单的 "Settings"
2. 点击 "API"
3. 复制以下信息：
   - **Project URL** (类似: `https://xxx.supabase.co`)
   - **anon public** key (以 `eyJ...` 开头)
   - **service_role** key (以 `eyJ...` 开头，**保密**)

### 3. 设置数据库架构
1. 在 Supabase 项目中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase/schema.sql` 文件的内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行 SQL

### 4. 创建存储桶
1. 点击左侧菜单的 "Storage"
2. 点击 "Create a new bucket"
3. 填写信息：
   - **Name**: `raw`
   - **Public**: 取消勾选（私有）
4. 点击 "Create bucket"

## 第二步：设置 Vercel 项目

### 1. 创建 Vercel 项目
1. 访问 [vercel.com](https://vercel.com)
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库 `news-intelligence-ui`
5. 点击 "Import"

### 2. 配置环境变量
在 Vercel 项目设置中添加以下环境变量：

**在 Vercel Dashboard 中：**
1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ... (anon key)
SUPABASE_SERVICE_ROLE_KEY = eyJ... (service_role key)
OPENAI_API_KEY = sk-... (你的 OpenAI API Key)
GITHUB_TOKEN = ghp_... (你的 GitHub Token，可选)
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### 3. 部署项目
1. 点击 "Deploy" 按钮
2. 等待部署完成（约 2-3 分钟）
3. 部署完成后，你会得到一个 URL（如：`https://news-intelligence-ui.vercel.app`）

## 第三步：本地测试

### 1. 创建本地环境变量文件
1. 复制 `env.example` 文件为 `.env.local`
2. 填入你的 Supabase 配置信息：

```bash
# 复制示例文件
cp env.example .env.local
```

然后编辑 `.env.local` 文件：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role key)
OPENAI_API_KEY=sk-... (你的 OpenAI API Key)
GITHUB_TOKEN=ghp_... (你的 GitHub Token，可选)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. 启动本地开发服务器
```bash
npm run dev
```

### 3. 测试 Supabase 连接
1. 打开浏览器访问 `http://localhost:3000`
2. 点击左侧菜单的 "Test Supabase"
3. 点击 "Test Connection" 按钮
4. 检查连接状态和测试结果

## 第四步：验证部署

### 1. 检查 Vercel 部署
1. 访问你的 Vercel 项目 URL
2. 确认页面正常加载
3. 测试所有功能页面

### 2. 检查 Supabase 连接
1. 在部署的网站上访问 "Test Supabase" 页面
2. 运行连接测试
3. 确认数据库连接正常

## 常见问题解决

### 问题 1: 环境变量未生效
**解决方案**: 
- 确保 `.env.local` 文件在项目根目录
- 重启开发服务器
- 检查变量名是否正确（注意 `NEXT_PUBLIC_` 前缀）

### 问题 2: Supabase 连接失败
**解决方案**:
- 检查 Project URL 是否正确
- 确认 anon key 没有过期
- 检查数据库架构是否正确创建

### 问题 3: Vercel 部署失败
**解决方案**:
- 检查环境变量是否在 Vercel 中正确设置
- 查看 Vercel 构建日志
- 确保所有依赖都已安装

### 问题 4: 权限错误
**解决方案**:
- 确保 service_role key 只在服务端使用
- 检查 Supabase RLS (Row Level Security) 设置
- 确认 API 密钥权限正确

## 下一步：添加数据源

部署成功后，你可以：

1. 在 "Sources" 页面添加数据源
2. 在 "Categories" 页面创建分类
3. 在 "Policies" 页面配置分析策略
4. 设置定时任务进行数据抓取

## 监控和维护

### 监控
- Vercel: 查看部署状态和性能指标
- Supabase: 监控数据库使用量和 API 调用
- 应用日志: 检查错误和性能问题

### 备份
- Supabase: 自动备份，可手动创建快照
- 代码: GitHub 仓库自动备份
- 环境变量: 保存在 Vercel 和本地

### 扩展
- 升级 Vercel 计划以获得更多资源
- 升级 Supabase 计划以获得更多存储和计算
- 添加更多数据源和分析策略

