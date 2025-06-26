# 博客项目

一个基于Next.js的现代化博客系统，提供用户认证、文章管理和响应式界面。

## 功能特点
- 用户注册与登录认证
- 博客文章发布与管理
- 响应式设计，适配各种设备
- 数据持久化存储

## 技术栈
- **前端**: Next.js, React, TypeScript, Tailwind CSS
- **后端**: Node.js, PostgreSQL
- **ORM**: Prisma
- **部署**: Docker

## 快速开始

### 前提条件
- Node.js (v18+)
- Docker
- npm 或 yarn

### 安装步骤
1. 克隆仓库
```bash
git clone <repository-url>
cd blog-project
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建`.env`文件并添加:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. 启动PostgreSQL容器
```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v /var/www/postgresql-docker:/var/lib/postgresql/data postgres
```

5. 应用数据库迁移
```bash
npx prisma migrate dev
```

6. 启动开发服务器
```bash
npm run dev
```

## 使用说明
- 访问 http://localhost:3000 查看博客
- 通过/login页面登录系统
- 创建、编辑和管理博客文章

## 许可证
MIT