# 轴承出口 B2B 外贸官网

## 项目概述
轴承出口 B2B 外贸官网，面向全球客户，支持六国语言，提供产品展示、在线询盘、订单结算、后台管理等完整功能。

## 技术栈
- 前端：React 19 + TypeScript + Tailwind CSS 4 + React Router v6 + Zustand + React Query
- 后端：NestJS 10 + Drizzle ORM + PostgreSQL
- 国际化：自研 i18n（六国语言：zh-CN, en, th, vi, id, es）
- 状态管理：Zustand
- UI 组件：shadcn/ui + lucide-react

## 设计规范

### 色彩系统
- 主色（Primary）：工业蓝 #0a4b8a - 专业、可靠、技术感
- 辅助色（Secondary）：橙金 #e87d0e - 温暖、活力、行动号召
- 背景色：#f8fafc（浅灰背景）、#ffffff（卡片背景）、#0f172a（深色区块）
- 文字色：#1e293b（主文字）、#64748b（次要文字）、#94a3b8（辅助文字）
- 边框色：#e2e8f0

### 间距规范
- 小间距：8px（space-2）
- 中间距：16px（space-4）
- 大间距：24px（space-6）
- 特大间距：48px（space-12）
- 区块间距：80px（py-20）

### 排版
- 标题：font-bold，大标题 48px，副标题 24px
- 正文：font-normal，16px，line-height 1.6
- 按钮文字：font-semibold，14px，uppercase tracking-wide

### 响应式断点
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 页面结构

### 前台页面
1. 首页（Home）- 轮播图、核心优势、产品分类、实力展示、客户案例、询价表单
2. 产品列表（Products）- 筛选网格布局、多维度筛选
3. 产品详情（ProductDetail）- 参数、工艺、认证、询价/下单
4. 关于我们（About）- 发展历程、资质荣誉、工厂实力、OEM/ODM能力
5. 询盘联系（Contact）- 询盘表单、谷歌地图、多渠道客服
6. 结算页面（Checkout）- 订单预览、金额核算、开票信息、支付
7. 隐私政策（Privacy）- 合规页面
8. 后台管理（Admin）- CMS、产品、询盘、订单管理

### 后台模块
1. 仪表盘 - 数据概览
2. 轮播图管理
3. 产品管理（分类+产品）
4. 案例资讯管理
5. 询盘管理
6. 订单管理（含支付记录、状态修改）
7. 数据导出

## 数据库设计

### 核心表
- bearing_products - 产品表
- bearing_categories - 产品分类表
- bearing_banners - 轮播图表
- bearing_cases - 客户案例表
- bearing_news - 资讯表
- bearing_inquiries - 询盘表
- bearing_orders - 订单表
- bearing_payments - 支付记录表
- bearing_cms_settings - CMS配置表

## 国际化
- 语言：zh-CN（简体中文）、en（English）、th（ไทย）、vi（Tiếng Việt）、id（Bahasa Indonesia）、es（Español）
- 实现：Zustand store + localStorage 持久化 + 语言包 JSON
- 默认语言：en

## SEO 关键词
### 英文核心词
- China bearing manufacturer
- China bearing supplier
- Custom bearing OEM ODM
- Wholesale bearing
- Southeast Asia bearing supplier
- Latin America standard bearing
- Industrial roller bearing
- High precision ball bearing
- Tapered roller bearing wholesale

### 中文核心词
- 轴承出口厂家
- 轴承 OEM 定制
- 东南亚轴承批发
- 拉美轴承出口供货

## 模块划分

### 后端模块
- cms - CMS内容管理（轮播图、案例、资讯、设置）
- products - 产品与分类
- inquiries - 询盘管理
- orders - 订单与支付
- admin - 后台管理聚合

### 前端模块
- pages/home - 首页
- pages/products - 产品列表与详情
- pages/about - 关于我们
- pages/contact - 询盘联系
- pages/checkout - 结算
- pages/admin - 后台管理
- components/layout - 布局组件（Header、Footer、Sidebar）
- components/i18n - 国际化
- store - 状态管理
