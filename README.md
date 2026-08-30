# Bearing Export B2B Website

> 轴承出口 B2B 外贸官网 — 面向全球客户的专业轴承出口企业展示与交易平台

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

## 目录

- [项目介绍](#项目介绍)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [生产部署](#生产部署)
- [部署到 Railway](#部署到-railway)
- [部署到 Render](#部署到-render)
- [部署到 Vercel（仅前端）](#部署到-vercel仅前端)
- [Docker 部署](#docker-部署)
- [后台管理说明](#后台管理说明)
- [多语言配置](#多语言配置)
- [数据库表结构](#数据库表结构)
- [常见问题 FAQ](#常见问题-faq)
- [License](#license)

---

## 项目介绍

**轴承出口 B2B 外贸官网** 是一套面向全球市场的轴承制造企业外贸独立站解决方案。采用前后端分离架构，支持六国语言，提供产品展示、在线询盘、订单结算、后台管理等完整功能。

项目专为轴承出口企业量身打造，聚焦东南亚、拉美、中东等新兴市场，支持 Stripe、PayPal 等主流国际支付方式，集成 Google Analytics、Facebook Pixel 等营销工具，帮助企业快速搭建专业的海外业务门户。

### 核心定位

- 🏭 **制造企业官网** — 展示工厂实力、资质认证、OEM/ODM 能力
- 📦 **产品展示平台** — 多维度筛选、详细参数、工艺说明
- 💬 **询盘获客系统** — 在线询盘表单、WhatsApp 客服、邮件通知
- 🛒 **B2B 小额批发** — 在线下单、国际支付、订单管理
- 🌍 **多语言国际化** — 6 种语言覆盖主要出口市场

---

## 功能特性

- 🌐 **六国语言支持** — 简体中文、English、ไทย、Tiếng Việt、Bahasa Indonesia、Español，一键切换，语言持久化
- 🎠 **首页轮播大图** — 支持多图轮播、跳转链接、排序管理，后台可视化配置
- 📦 **产品管理系统** — 多级分类、多维度筛选（类型/材质/尺寸/用途）、产品详情页含参数/工艺/认证标签
- 🏭 **工厂实力展示** — 发展历程时间轴、资质证书、生产设备、OEM/ODM 服务介绍
- 💬 **在线询盘系统** — 询盘表单支持附件上传、后台询盘列表管理、邮件通知、导出 Excel
- 🛒 **在线订单系统** — 购物车、结算页面、Stripe/PayPal 支付、订单状态跟踪
- 📊 **数据仪表盘** — 访问趋势、询盘统计、订单金额、热销产品排行一目了然
- 📰 **案例与资讯** — 客户案例展示、行业资讯发布、SEO 友好的文章页面
- 📱 **响应式设计** — 移动端优先，完美适配手机、平板、桌面各种设备
- 🔧 **可视化后台** — 无需写代码，所有前台内容均可在 `/admin` 后台管理
- 🔐 **安全认证** — JWT Token 鉴权、管理员独立 Token、CSRF 防护、输入校验
- 📈 **营销集成** — Google Analytics 4、Facebook Pixel、WhatsApp 悬浮按钮、Google 地图
- 🚀 **SEO 友好** — 语义化 HTML、Meta 标签、Open Graph、结构化数据
- 💾 **数据库备份** — 支持 PostgreSQL 全量备份与恢复

---

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **前端框架** | React | 19.x | 用户界面库 |
| **前端语言** | TypeScript | 5.6+ | 类型安全 |
| **构建工具** | Vite | 6.x | 极速构建与热更新 |
| **样式方案** | Tailwind CSS | 4.x | 原子化 CSS |
| **UI 组件库** | shadcn/ui | latest | 高质量可定制组件 |
| **图标库** | lucide-react | 0.450+ | 精美 SVG 图标 |
| **路由管理** | React Router DOM | 6.x | 客户端路由 |
| **状态管理** | Zustand | 5.x | 轻量状态管理 |
| **数据请求** | React Query / Axios | 5.x / 1.7x | 服务端状态与 HTTP 客户端 |
| **后端框架** | NestJS | 10.x | 企业级 Node.js 框架 |
| **ORM** | Drizzle ORM | 0.36+ | 类型安全的 TypeScript ORM |
| **数据库** | PostgreSQL | 16+ | 关系型数据库 |
| **认证方案** | JWT | - | JSON Web Token 鉴权 |
| **国际化** | 自研 i18n（Zustand） | - | 六国语言支持 |
| **支付集成** | Stripe / PayPal | - | 国际支付网关 |
| **邮件服务** | SMTP / Nodemailer | - | 询盘通知邮件 |
| **部署方案** | Docker / Railway / Render / Vercel | - | 多种部署方式 |

---

## 目录结构

```
bearing-export-website/
├── client/                    # 前端代码
│   ├── src/
│   │   ├── api/               # API 请求封装
│   │   ├── components/        # 通用组件
│   │   ├── pages/             # 页面组件
│   │   ├── store/             # Zustand 状态管理
│   │   ├── i18n/              # 国际化语言包
│   │   ├── utils/             # 工具函数
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── app.tsx            # 应用入口
│   │   └── index.css          # 全局样式
│   └── index.html             # HTML 模板
├── server/                    # 后端代码
│   ├── modules/               # 业务模块
│   │   ├── bearing-cms/       # CMS 内容管理
│   │   ├── bearing-products/  # 产品与分类
│   │   ├── bearing-inquiries/ # 询盘管理
│   │   ├── bearing-orders/    # 订单与支付
│   │   └── bearing-admin/     # 后台管理聚合
│   ├── common/                # 共享工具
│   ├── database/              # 数据库 Schema
│   └── main.ts                # 应用入口
├── shared/                    # 前后端共享类型
│   └── api.interface.ts       # API 接口类型定义
├── sql/                       # SQL 脚本
│   ├── schema.sql             # 建表脚本
│   ├── seed.sql               # 初始数据
│   └── seed_products.sql      # 示例产品数据
├── scripts/                   # 脚本
│   └── start.sh               # 生产启动脚本
├── .env.example               # 环境变量示例
├── .gitignore                 # Git 忽略配置
├── .dockerignore              # Docker 忽略配置
├── Dockerfile                 # Docker 镜像构建
├── railway.json               # Railway 部署配置
├── render.yaml                # Render 部署配置
├── vercel.json                # Vercel 前端部署配置
├── package.json               # 项目依赖
├── README.md                  # 项目说明（本文件）
├── DEPLOYMENT.md              # 详细部署指南
└── CHANGELOG.md               # 变更日志
```

---

## 快速开始

### 环境要求

| 工具 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 22.0.0 | 22.x LTS |
| npm | 10.x | 10.x |
| PostgreSQL | 14 | 16 |
| Git | 2.30 | 最新 |

> 检查版本：`node --version`、`npm --version`、`psql --version`

### 1. 克隆项目

```bash
git clone <repository-url>
cd bearing-export-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入必要配置
# 至少需要配置：
# - DATABASE_URL：数据库连接串
# - JWT_SECRET：JWT 密钥
# - ADMIN_TOKEN：后台管理 Token
```

关键环境变量说明：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PORT` | 后端服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` / `production` |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://user:pass@localhost:5432/bearing_db` |
| `JWT_SECRET` | JWT 签名密钥 | 随机长字符串 |
| `JWT_EXPIRES_IN` | Token 有效期 | `7d` |
| `ADMIN_TOKEN` | 后台管理登录 Token | 随机长字符串 |
| `APP_NAME` | 应用名称 | `Bearing Export` |
| `DEFAULT_LANGUAGE` | 默认语言 | `en` |
| `SITE_URL` | 站点域名 | `https://your-domain.com` |

### 4. 初始化数据库

确保 PostgreSQL 已启动，然后执行：

```bash
# 创建数据库
createdb bearing_db

# 执行建表脚本
npm run db:migrate

# 导入初始数据（可选，包含示例产品和轮播图）
npm run db:seed
```

> 也可以手动执行 SQL 文件：
> ```bash
> psql postgresql://user:pass@localhost:5432/bearing_db < sql/schema.sql
> psql postgresql://user:pass@localhost:5432/bearing_db < sql/seed.sql
> ```

### 5. 启动开发服务器

```bash
# 同时启动前后端（推荐）
npm run dev

# 或分别启动
npm run dev:server   # 后端：http://localhost:3000
npm run dev:client   # 前端：http://localhost:5173
```

- **前端地址**：http://localhost:5173
- **后端 API**：http://localhost:3000/api
- **健康检查**：http://localhost:3000/api/health
- **后台管理**：http://localhost:5173/admin（使用 ADMIN_TOKEN 登录）

---

## 生产部署

### 构建

```bash
npm run build
```

构建产物位于 `dist/` 目录：
- `dist/server/` — 后端代码
- `dist/client/` — 前端静态文件

### 启动生产服务

```bash
# 方式一：直接启动
npm run start:prod

# 方式二：使用启动脚本
chmod +x scripts/start.sh
./scripts/start.sh

# 方式三：使用 PM2 进程管理（推荐）
npm install -g pm2
pm2 start dist/server/main.js --name bearing-website
pm2 save
pm2 startup
```

### 环境变量

生产环境务必设置以下变量：

```bash
NODE_ENV=production
JWT_SECRET=<your-strong-secret-key>
ADMIN_TOKEN=<your-admin-token>
DATABASE_URL=<your-postgresql-connection>
SITE_URL=https://your-domain.com
```

> 💡 **安全提示**：`JWT_SECRET` 和 `ADMIN_TOKEN` 务必使用强随机字符串，推荐 32 位以上。
> 生成方式：`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 部署到 Railway

[Railway](https://railway.app/) 是一个提供全栈部署的 PaaS 平台，支持一键部署。

### 前置要求

- Railway 账号
- GitHub 仓库（或手动上传）

### 部署步骤

1. **Fork 项目到你的 GitHub**

2. **登录 Railway 控制台**，点击「New Project」→「Deploy from GitHub repo」

3. **选择你的仓库**，Railway 会自动检测 `railway.json` 配置

4. **添加 PostgreSQL 数据库**
   - 在项目中点击「New」→「Database」→「Add PostgreSQL」
   - 等待数据库创建完成

5. **配置环境变量**
   - 进入服务 → Variables → 添加以下变量：
     ```
     JWT_SECRET=<随机生成的强密钥>
     ADMIN_TOKEN=<后台管理密码>
     SITE_URL=https://your-domain.com
     APP_NAME=Bearing Export
     DEFAULT_LANGUAGE=en
     ```
   - `DATABASE_URL` 会自动从数据库服务注入

6. **初始化数据库**
   - 进入服务 → 打开 Console
   - 执行以下命令：
     ```bash
     npm run db:migrate
     npm run db:seed
     ```

7. **配置自定义域名**（可选）
   - Settings → Domains → 添加自定义域名
   - 按提示配置 DNS 解析

8. **完成部署**，访问分配的域名即可

> 项目根目录已包含 `railway.json`，Railway 会自动使用 Nixpacks 构建。

---

## 部署到 Render

[Render](https://render.com/) 是一个支持 Blueprint 的全栈部署平台。

### 前置要求

- Render 账号
- GitHub 仓库

### 部署步骤

1. **Fork 项目到你的 GitHub**

2. **登录 Render 控制台**，点击「Blueprints」→「New Blueprint Instance」

3. **选择你的仓库**，Render 会读取 `render.yaml` 配置

4. **配置 Blueprint**
   - Blueprint 名称：`bearing-export-website`
   - 分支：`main`
   - 确认 Web Service 和 PostgreSQL Database 都已识别

5. **填写环境变量**
   - `SITE_URL`：你的站点域名
   - 其他变量可使用 Render 自动生成的值

6. **点击「Apply」** 开始部署

7. **初始化数据库**
   - 部署完成后，进入 Web Service → Shell
   - 执行：
     ```bash
     npm run db:migrate
     npm run db:seed
     ```

8. **配置自定义域名**（可选）
   - Settings → Custom Domains → Add Custom Domain
   - 按提示配置 DNS

### Blueprint 说明

`render.yaml` 定义了：
- 1 个 Web Service（Node.js 运行时，Standard 计划）
- 1 个 PostgreSQL 数据库（Standard 计划，PostgreSQL 16）
- 自动通过 `connectionString` 注入 `DATABASE_URL`

---

## 部署到 Vercel（仅前端）

如果你使用独立的后端服务，可以将前端单独部署到 Vercel。

### 前置要求

- Vercel 账号
- GitHub 仓库
- 已部署的后端 API 服务

### 部署步骤

1. **Fork 项目到你的 GitHub**

2. **登录 Vercel**，点击「Add New」→「Project」

3. **Import 你的仓库**

4. **配置项目**
   - Framework Preset：选择「Other」
   - Build Command：`npm run build:client`
   - Output Directory：`dist/client`
   - Install Command：`npm install`

5. **配置环境变量**
   - 在 Environment Variables 中添加后端 API 地址（如需要）：
     ```
     VITE_API_BASE_URL=https://your-api-domain.com/api
     ```

6. **点击「Deploy」** 开始部署

7. **配置自定义域名**（可选）
   - Settings → Domains → 添加域名

> ⚠️ **注意**：Vercel 部署仅包含前端静态页面，后端 API 需要单独部署。
> 前端 API 请求的 base URL 需要通过环境变量 `VITE_API_BASE_URL` 配置。

---

## Docker 部署

### 构建镜像

```bash
docker build -t bearing-export-website .
```

### 运行容器

```bash
docker run -d \
  --name bearing-website \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db-host:5432/bearing_db \
  -e JWT_SECRET=your-secret-key \
  -e ADMIN_TOKEN=your-admin-token \
  -e SITE_URL=https://your-domain.com \
  --restart unless-stopped \
  bearing-export-website
```

### 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://bearing:bearing_pass@db:5432/bearing_db
      JWT_SECRET: change_me_to_a_strong_random_string
      ADMIN_TOKEN: admin_change_me_to_a_strong_random_string
      SITE_URL: https://your-domain.com
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: bearing
      POSTGRES_PASSWORD: bearing_pass
      POSTGRES_DB: bearing_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

启动：

```bash
docker-compose up -d
```

---

## 后台管理说明

### 访问路径

- **开发环境**：`http://localhost:5173/admin`
- **生产环境**：`https://your-domain.com/admin`

### 登录方式

使用 `.env` 文件中配置的 `ADMIN_TOKEN` 登录。

> 🔐 **安全建议**：
> - 生产环境务必修改默认的 `ADMIN_TOKEN`
> - 使用强随机字符串（至少 32 位）
> - 定期更换 Token

### 功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| **仪表盘** | `/admin/dashboard` | 数据概览：询盘统计、订单金额、访问趋势 |
| **轮播图管理** | `/admin/banners` | 首页轮播图：添加/编辑/排序/删除 |
| **分类管理** | `/admin/categories` | 产品分类：层级管理、排序、多语言名称 |
| **产品管理** | `/admin/products` | 产品列表：增删改查、上下架、批量操作 |
| **案例管理** | `/admin/cases` | 客户案例：图片、描述、排序 |
| **资讯管理** | `/admin/news` | 行业资讯：发布、编辑、分类 |
| **询盘管理** | `/admin/inquiries` | 询盘列表：查看、标记已读、导出 |
| **订单管理** | `/admin/orders` | 订单列表：状态管理、支付记录、导出 |
| **系统设置** | `/admin/settings` | CMS 全局配置、联系方式、SEO 设置 |

---

## 多语言配置

### 支持语言

| 语言代码 | 语言名称 | 目标市场 |
|---------|---------|---------|
| `zh-CN` | 简体中文 | 中国市场 |
| `en` | English | 全球通用 |
| `th` | ไทย | 泰国 / 东南亚 |
| `vi` | Tiếng Việt | 越南 / 东南亚 |
| `id` | Bahasa Indonesia | 印尼 / 东南亚 |
| `es` | Español | 拉美 / 西班牙 |

默认语言：`en`（英文）

### 切换默认语言

修改 `.env` 文件：

```bash
DEFAULT_LANGUAGE=zh-CN
```

### 新增语言

1. **创建语言包文件**

```bash
# 复制英文语言包作为模板
cp client/src/i18n/locales/en.ts client/src/i18n/locales/fr.ts
```

2. **翻译内容**

编辑 `client/src/i18n/locales/fr.ts`，将所有英文文本翻译为目标语言。

3. **注册语言**

编辑 `client/src/i18n/index.ts`，在 `locales` 对象中添加：

```typescript
import fr from './locales/fr';

export const locales: Record<string, typeof en> = {
  'zh-CN': zhCN,
  en,
  th,
  vi,
  id,
  es,
  fr,  // 新增
};
```

4. **添加语言选项**

在 Header 组件的语言选择器中添加对应选项。

5. **后端适配**（如需要）

后端多语言字段在数据库中已预留，新增语言时确保产品、分类等表的多语言字段已对应添加。

---

## 数据库表结构

项目使用 PostgreSQL 数据库，共 9 张核心表：

### 1. bearing_products — 产品表

存储所有产品信息，包含多语言字段（名称、描述、参数等）。

**主要字段**：`id`, `sku`, `category_id`, `name_zh_cn`, `name_en`, `name_th`, `name_vi`, `name_id`, `name_es`, `images`, `specs` (JSON), `price`, `stock`, `is_active`, `sort_order`, `created_at`, `updated_at`

### 2. bearing_categories — 产品分类表

产品分类，支持多级层级结构。

**主要字段**：`id`, `parent_id`, `name_zh_cn`, `name_en`, `name_th`, `name_vi`, `name_id`, `name_es`, `slug`, `icon`, `sort_order`, `is_active`, `created_at`

### 3. bearing_banners — 轮播图表

首页轮播大图配置。

**主要字段**：`id`, `title_zh_cn`, `title_en`, `title_th`, `title_vi`, `title_id`, `title_es`, `image_url`, `link_url`, `sort_order`, `is_active`, `created_at`

### 4. bearing_cases — 客户案例表

展示成功客户案例。

**主要字段**：`id`, `title_zh_cn`, `title_en`, `title_th`, `title_vi`, `title_id`, `title_es`, `description`, `cover_image`, `images`, `sort_order`, `is_active`, `created_at`

### 5. bearing_news — 资讯表

行业资讯和新闻文章。

**主要字段**：`id`, `title_zh_cn`, `title_en`, `title_th`, `title_vi`, `title_id`, `title_es`, `content`, `cover_image`, `category`, `views`, `is_published`, `published_at`, `created_at`

### 6. bearing_inquiries — 询盘表

客户提交的询盘记录。

**主要字段**：`id`, `name`, `email`, `phone`, `company`, `country`, `product_id`, `message`, `attachments`, `is_read`, `source`, `ip_address`, `created_at`

### 7. bearing_orders — 订单表

客户订单记录。

**主要字段**：`id`, `order_no`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `items` (JSON), `subtotal`, `shipping_fee`, `tax`, `total_amount`, `currency`, `status`, `payment_method`, `payment_status`, `created_at`, `updated_at`

### 8. bearing_payments — 支付记录表

订单支付交易记录。

**主要字段**：`id`, `order_id`, `payment_method`, `transaction_id`, `amount`, `currency`, `status`, `raw_response` (JSON), `paid_at`, `created_at`

### 9. bearing_cms_settings — CMS 配置表

全局 CMS 设置，键值对存储。

**主要字段**：`id`, `key`, `value`, `description`, `updated_at`

---

## 常见问题 FAQ

### 1. 如何修改后台管理密码？

修改 `.env` 文件中的 `ADMIN_TOKEN` 变量，然后重启服务即可。

```bash
ADMIN_TOKEN=<你的新密码>
```

> 推荐使用随机生成的强密码：`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 2. 前端和后端如何跨域部署？

后端支持 CORS，默认允许所有来源。生产环境建议在 `server/main.ts` 中配置具体的允许域名。
前端通过 `VITE_API_BASE_URL` 环境变量指定后端 API 地址。

### 3. 如何添加新产品分类？

登录后台 → 分类管理 → 新增分类，填写多语言名称和排序，保存后即可在产品管理和前台页面使用。

### 4. 支付配置了但无法支付怎么办？

请按以下步骤排查：
1. 检查 Stripe/PayPal 的密钥是否正确（测试模式 vs 生产模式）
2. 确认 Webhook URL 是否已配置
3. 查看后端日志中的错误信息
4. 确保服务器可以访问支付网关 API（部分地区可能需要代理）

### 5. 如何备份数据库？

```bash
# 全量备份
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 恢复
psql $DATABASE_URL < backup_20260829.sql
```

也可以使用数据库服务商的自动备份功能（Railway / Render 均提供）。

### 6. 图片上传存储在哪里？

默认上传到本地 `uploads/` 目录。生产环境建议配置云存储（如 AWS S3、阿里云 OSS），
通过 `STORAGE_BUCKET` 环境变量配置。Docker 部署时需要挂载 volume 持久化存储。

### 7. 网站访问慢如何优化？

1. **启用 CDN**：前端静态资源使用 Cloudflare / Vercel CDN
2. **图片优化**：上传前压缩图片，使用 WebP 格式
3. **数据库索引**：确保常用查询字段有索引
4. **启用缓存**：产品列表等热点数据添加 Redis 缓存
5. **Gzip 压缩**：Nginx 开启 gzip 压缩

### 8. 支持哪些支付方式？

目前支持：
- **Stripe** — 信用卡 / 借记卡，支持全球主要国家
- **PayPal** — PayPal 账户支付，全球通用
- 可扩展：中东 Telr / PayTabs、东南亚 GrabPay 等

支付配置在 `.env` 文件中设置对应的密钥即可启用。

---

## License

[MIT](LICENSE)

Copyright (c) 2026 Bearing Export Website

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
