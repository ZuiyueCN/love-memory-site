# 部署说明

推荐把网站部署到 Vercel，数据库和图片存储继续使用 Supabase。这个项目依赖 Next.js Server Actions、Prisma、Supabase Storage，不适合部署成纯静态站点。

## 上线前检查

1. 在 Supabase 创建或确认 Postgres 数据库。
2. 在 Supabase Storage 创建公开 bucket，名称与 `SUPABASE_STORAGE_BUCKET` 保持一致，默认是 `love-photos`。
3. Vercel Function 请求体上限是 4.5MB，当前 V1 已把单张图片上传限制设为 4MB。上传前建议先压缩大图。
4. 确认本地生产构建通过：

```bash
npm run build
```

5. 生产数据库迁移使用：

```bash
npm run prisma:deploy
```

开发环境仍可使用：

```bash
npm run prisma:migrate
```

## Vercel 配置

在 Vercel 导入项目后，保持 Next.js 默认配置即可：

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

需要在 Vercel 的 Environment Variables 中配置：

```bash
DATABASE_URL="你的 Supabase Postgres 连接串，推荐使用 Supavisor pooler"
NEXT_PUBLIC_SUPABASE_URL="你的 Supabase 项目 URL"
SUPABASE_SERVICE_ROLE_KEY="你的 Supabase service role key"
SUPABASE_STORAGE_BUCKET="love-photos"
ADMIN_EMAIL="你的管理员邮箱"
ADMIN_INITIAL_PASSWORD="你的初始管理员密码"
SESSION_SECRET="至少 32 位随机字符串"
```

## 数据库连接建议

Vercel 属于 serverless/自动扩缩环境。Supabase + Prisma 上线时，优先使用 Supabase 提供的 Supavisor pooler 连接串，降低连接数耗尽风险，也能避开部分本地或部署环境直连数据库不可达的问题。

如果后续访问量明显增加，再考虑 Prisma Accelerate、专用连接池或独立 Node 服务部署。

## 安全注意

- 不要把 `.env` 上传到仓库。
- `SUPABASE_SERVICE_ROLE_KEY` 权限很高，只能放在服务端环境变量中。
- 不要在前端代码中使用 `SUPABASE_SERVICE_ROLE_KEY`。
- `SESSION_SECRET` 必须使用足够长的随机字符串，建议至少 32 位。

## 部署后验收

1. 首页、相册、动态、留言板可以正常访问。
2. `/login` 可以登录后台。
3. 后台上传图片后，图片能在页面展示。
4. 评论、留言、动态新增和删除能正常写入数据库。
