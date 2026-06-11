# 简历生成器 (Resume Generator)

一个基于 AI 的全栈简历生成与管理项目，包含：

- **后端服务**：基于 Node.js + Express，集成 AI 接口（可接入 OpenAI 兼容 API），支持简历 CRUD、岗位匹配、AI 简历优化
- **前端 Web**：基于 Vue 3 + Vite + Element Plus，提供直观的简历编辑与预览界面
- **小程序端**：基于 uni-app (Vue 3 + TS)，一套代码可同时发布到微信小程序/H5
- **部署支持**：一键部署脚本 + Nginx + systemd，可直接部署到 Linux 服务器

---

## 目录

- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [后端 API](#后端-api)
- [前端开发](#前端开发)
- [小程序开发](#小程序开发)
- [单元测试](#单元测试)
- [部署](#部署)
- [常见问题](#常见问题)
- [License](#license)

---

## 功能特性

- 📝 **简历管理**：创建 / 查询 / 更新 / 删除简历，支持基本信息、教育背景、工作经历、技能、项目经历
- 🤖 **AI 生成**：调用兼容 OpenAI 的大模型接口，自动生成简历摘要、核心竞争力、项目符号化内容等
- 🎯 **岗位匹配**：基于关键词提取算法，计算简历与岗位描述的匹配度与匹配/缺失关键词
- 🔧 **简历优化建议**：根据岗位描述自动生成针对性的简历优化建议
- 🌐 **Web 前端**：Vue 3 + Element Plus，响应式页面，支持预览与打印
- 📱 **跨端小程序**：uni-app + Vue 3 + TypeScript，一套代码支持 H5/微信小程序
- 🧪 **单元测试**：Jest 覆盖后端服务层核心逻辑，保证代码可测试、可维护
- 🚀 **一键部署**：`scripts/deploy.sh` 自动打包 + Nginx + systemd 部署

---

## 项目结构

```
.
├── backend/           # Node.js + Express 后端
│   ├── config/     # 配置文件
│   ├── controllers/  # 路由控制器
│   ├── routes/      # 路由定义
│   ├── services/    # 业务服务
│   ├── data/       # 本地 JSON 数据存储
│   ├── tests/      # 单元测试（Jest）
│   └── server.js  # 服务入口
├── frontend/        # Vue 3 + Vite 前端
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── router/    # 路由
│   │   └── utils/     # 工具库（HTTP 等）
│   └── vite.config.js
├── miniprogram/      # uni-app 小程序
│   └── src/
├── scripts/         # 部署脚本与配置
│   ├── deploy.sh
│   ├── nginx.conf
│   └── resume-backend.service
├── deploy/        # deploy.sh 生成的部署产物目录
└── DEPLOY.md    # 详细部署指南
```

---

## 环境要求

| 组件 | 版本要求 |
| ---- | -------- |
| Node.js | 18+ |
| npm | 随 Node.js 提供 |
| 浏览器 | 现代浏览器（Chrome/Edge/Firefox/Safari） |
| 微信开发者工具（小程序） | 最新稳定版 |

---

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <project
```

### 2. 启动后端

```bash
cd backend
npm install
npm start          # 生产启动
# 或
npm run dev       # 开发模式（需 nodemon）
```

后端默认监听 `http://localhost:3000`。

如需接入 AI 能力，配置环境变量（可选）：

```bash
export AI_API_URL=https://api.openai.com/v1
export AI_API_KEY=sk-xxxxxx
export AI_MODEL=gpt-3.5-turbo
```

> 未配置时，AI 服务会自动降级到本地 mock 数据，方便本地开发与测试。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

构建生产产物位于 `frontend/dist/`。

### 4. 启动小程序

```bash
cd miniprogram
npm install
# H5 本地调试
npm run dev:h5
# 微信小程序
npm run dev:mp-weixin
```

详见 [uni-app 文档](https://uniapp.dcloud.net.cn/)。

---

## 后端 API

所有 API 统一返回 JSON，前缀默认挂载在 `/api` 下（见 [server.js](backend/server.js)：

- `GET    /api/resumes` —— 查询所有简历
- `GET    /api/resumes/:id` —— 查询单份简历
- `POST   /api/resumes` —— 创建简历
- `PUT    /api/resumes/:id` —— 更新简历
- `DELETE /api/resumes/:id` —— 删除简历
- `POST   /api/resumes/:id/generate` —— 根据岗位描述生成定向简历
- `POST   /api/jobs/match` —— 岗位匹配
- `POST   /api/jobs/analyze` —— 岗位分析
- `GET    /api/jobs/suggestions` —— 岗位建议
- `POST   /api/ai/generate` —— AI 生成简历
- `POST   /api/ai/optimize` —— AI 优化简历
- `POST   /api/ai/analyze-job` —— AI 分析岗位
- `POST   /api/ai/summary` —— AI 文本摘要
- `POST   /api/ai/bullet-points` —— AI 项目符号化

### 示例

```bash
# 创建简历
curl -X POST http://localhost:3000/api/resumes \
  -H 'Content-Type: application/json' \
  -d '{"name":"张三","title":"前端工程师","email":"zhangsan@example.com","skills":[{"name":"JavaScript","level":"熟练"}]}'

# 岗位匹配
curl -X POST http://localhost:3000/api/jobs/match \
  -H 'Content-Type: application/json' \
  -d '{"resumeId":"<resume-id>","jobDescription":"熟练使用 JavaScript / React / Vue，具备良好的团队协作能力"}'
```

---

## 前端开发

前端使用 **Vue 3 + Vite + Element Plus + Vue Router + Axios**。

| 文件 | 说明 |
| ---- | ---- |
| [src/pages/Home.vue](frontend/src/pages/Home.vue) | 首页 / 简历列表 |
| [src/pages/CreateResume.vue](frontend/src/pages/CreateResume.vue) | 创建简历 |
| [src/pages/EditResume.vue](frontend/src/pages/EditResume.vue) | 编辑简历 |
| [src/pages/PreviewResume.vue](frontend/src/pages/PreviewResume.vue) | 预览简历 |
| [src/pages/JobMatch.vue](frontend/src/pages/JobMatch.vue) | 岗位匹配 |
| [src/utils/api.js](frontend/src/utils/api.js) | axios 请求封装 |

开发命令：

```bash
cd frontend
npm run dev       # 开发
npm run build     # 构建
npm run preview   # 预览构建产物
```

---

## 小程序开发

小程序使用 **uni-app + Vue 3 + TypeScript**，位于 [miniprogram/](miniprogram/)。

- 页面配置见 [pages.json](miniprogram/src/pages.json)
- 样式变量与请求封装见 [api.ts](miniprogram/src/utils/api.ts)

```bash
cd miniprogram
npm install
npm run dev:h5            # H5 调试
npm run build:h5           # H5 构建
npm run dev:mp-weixin     # 微信小程序
npm run build:mp-weixin   # 微信小程序构建
```

微信小程序构建后，使用微信开发者工具打开 `miniprogram/dist/dev/mp-weixin`。

---

## 单元测试

后端使用 **Jest** 进行服务层单元测试，覆盖：

- [resumeService](backend/services/resumeService.js) 的 CRUD 与定向生成
- [jobService](backend/services/jobService.js) 的匹配与分析
- [aiService](backend/services/aiService.js) 的 mock 降级

### 运行测试

```bash
cd backend
npm install        # 安装依赖（首次）
npm test            # 运行全部测试
npm run test:watch  # watch 模式
npm run test:coverage  # 覆盖率报告
```

### 新增测试

测试文件位于 [backend/tests/](backend/tests/)，命名为 `*.test.js`。示例：

```javascript
const jobService = require('../services/jobService')

test('analyzeJob 能从岗位描述提取关键词', async () => {
  const result = await jobService.analyzeJob('熟练使用 JavaScript Vue 团队协作')
  expect(result.keywords).toEqual(expect.arrayContaining(['JavaScript', 'Vue']))
})
```

### 测试隔离

为避免测试污染真实数据，`resumeService` 的测试通过环境变量 `STORAGE_DIR` 指向临时目录，每次测试独立隔离。详见 [backend/tests/resumeService.test.js](backend/tests/resumeService.test.js)。

---

## 部署

### 方式一：一键部署脚本

```bash
chmod +x scripts/deploy.sh
# 编辑脚本顶部的 SERVER_HOST / SERVER_USER
./scripts/deploy.sh
```

### 方式二：手动部署

详细步骤、Nginx + systemd

详见 [DEPLOY.md](DEPLOY.md)。

---

## 常见问题

**Q: 启动后端报端口被占用？**
A: 设置 `PORT=4000 npm start 即可更换端口。

**Q: 前端无法调用后端接口？**
A: 修改 [frontend/src/utils/api.js](frontend/src/utils/api.js) 中的 `baseURL` 指向你的后端地址，或在构建时通过环境变量设置。

**Q: AI 接口返回 mock 数据？**
A: 未配置 `AI_API_KEY` 时 AI 服务会降级到本地 mock。配置环境变量后即可启用真实 AI 调用。

**Q: 如何运行单元测试？**
A: `cd backend && npm install && npm test`。

---

## License

本项目代码遵循 [MIT License](LICENSE) 协议。
