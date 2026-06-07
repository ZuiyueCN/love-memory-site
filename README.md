# 恋爱纪念网站

一个用来展示恋爱照片、动态、时间线和留言的网站。普通访客可以直接浏览，主人登录后可以管理内容。

## 功能

- 首页：封面、最近动态、精选照片、时间线预览。
- 相册页：响应式照片墙，支持分类筛选、点击大图预览和照片评论。
- 时间线页：按日期与排序展示恋爱节点。
- 动态页：像微信朋友圈一样发布一条多图动态，最多 9 张照片。
- 留言板：访客可以留言，主人可在后台置顶或删除。
- 登录系统：只允许环境变量中配置的主人邮箱登录。
- 管理后台：上传照片，新增、编辑、删除照片、时间线、组图动态、评论和留言。
- 图片存储：使用 Supabase Storage。
- 数据库：使用 Supabase Postgres + Prisma。

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 复制环境变量：

```bash
cp .env.example .env
```

3. 在 `.env` 中填写：

```bash
DATABASE_URL="你的 Supabase Postgres 连接串，推荐使用 Supavisor pooler"
NEXT_PUBLIC_SUPABASE_URL="你的 Supabase 项目 URL"
SUPABASE_SERVICE_ROLE_KEY="你的 Supabase service role key"
SUPABASE_STORAGE_BUCKET="love-photos"
ADMIN_EMAIL="你的主人邮箱"
ADMIN_INITIAL_PASSWORD="你的初始密码"
SESSION_SECRET="至少 32 位随机字符串"
AUTH_COOKIE_SECURE="本地或 HTTP 公网 IP 填 false，HTTPS 域名填 true"
```

4. 在 Supabase Storage 创建公开 bucket，名称与 `SUPABASE_STORAGE_BUCKET` 保持一致，默认是 `love-photos`。

5. 初始化数据库：

```bash
npm run prisma:migrate
npm run seed
```

6. 启动开发服务器：

```bash
npm run dev
```

打开 `http://localhost:3000` 浏览网站，访问 `http://localhost:3000/login` 登录管理后台。

## 已有项目升级

如果你已经跑过旧版本，现在新增了评论、留言板和组图动态，需要重新执行一次数据库迁移：

```bash
npm run prisma:migrate
npm run prisma:generate
npm run dev
```

新增页面：

```text
/album      相册分类、照片预览、评论
/moments    朋友圈式组图动态
/guestbook  留言板
```

## 部署说明

推荐部署到 Vercel，数据库和图片继续使用 Supabase。

部署前先确认：

- Supabase Postgres 已经执行过 Prisma migration。
- Supabase Storage 已创建公开 bucket，名称与 `SUPABASE_STORAGE_BUCKET` 一致。
- 本地执行 `npm run build` 可以通过。
- 当前 V1 会在浏览器端自动压缩大图，单张图片保存前限制为 4MB；阿里云服务器部署时建议把 Nginx `client_max_body_size` 设为 `50M`，方便组图上传。
- `.env` 不要上传到公开仓库，线上只在 Vercel 的 Environment Variables 里填写。

Vercel 环境变量需要填写：

```bash
DATABASE_URL="你的 Supabase Postgres 连接串，推荐使用 Supavisor pooler"
NEXT_PUBLIC_SUPABASE_URL="你的 Supabase 项目 URL"
SUPABASE_SERVICE_ROLE_KEY="你的 Supabase service role key"
SUPABASE_STORAGE_BUCKET="love-photos"
ADMIN_EMAIL="你的主人邮箱"
ADMIN_INITIAL_PASSWORD="你的初始密码"
SESSION_SECRET="至少 32 位随机字符串"
AUTH_COOKIE_SECURE="本地或 HTTP 公网 IP 填 false，HTTPS 域名填 true"
```

Vercel 构建设置保持默认即可：

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

注意：`SUPABASE_SERVICE_ROLE_KEY` 权限很高，只能放在服务端环境变量中，不要写进页面代码，也不要公开给别人。

## 项目结构

```text
app/                 Next.js App Router 页面和 Server Actions
components/          展示组件、表单组件、后台管理组件
lib/                 Prisma、Supabase、鉴权和格式化工具
prisma/              数据模型和 seed 脚本
```
