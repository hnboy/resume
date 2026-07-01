# 简历生成器项目总结文档

> 项目代号：Resume Generator
> 文档版本：v1.0
> 更新日期：2026-07-01

---

## 一、项目概述

### 1.1 项目背景

面向毕业生和求职者的简历智能生成与管理系统，支持：
- 多端简历编辑与管理（Web + 小程序）
- 基于 AI 的简历内容自动生成与优化
- 基于岗位描述的定向简历生成与匹配度分析
- 一键部署到生产服务器

### 1.2 项目目标

1. **降低简历制作门槛**：毕业生只需填写基础信息，AI 辅助生成专业简历
2. **提升求职效率**：根据不同岗位一键生成针对性简历，分析匹配度
3. **多端覆盖**：Web 端 + 微信小程序，满足不同使用场景
4. **开箱即用**：一键部署脚本，快速上线

### 1.3 核心用户

- 应届毕业生
- 求职人群
- HR / 招聘团队（用于简历筛选参考）

---

## 二、技术架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                      客户端层                          │
│  ┌──────────────┐          ┌──────────────────┐      │
│  │  Web 前端     │          │   微信小程序 / H5  │      │
│  │ (Vue 3 + EP) │          │  (uni-app + Vue3)│      │
│  └──────┬───────┘          └────────┬─────────┘      │
└─────────┼───────────────────────────┼────────────────┘
          │                           │
          └─────────────┬─────────────┘
                        │ HTTP/REST API
          ┌─────────────┴─────────────┐
          │    Nginx 反向代理 / 静态    │
          │     资源服务               │
          └─────────────┬─────────────┘
                        │
          ┌─────────────┴─────────────┐
          │   后端服务 (Express)        │
          │  - RESTful API              │
          │  - 简历 CRUD                │
          │  - 岗位匹配                 │
          │  - AI Agent                 │
          └─────────────┬─────────────┘
                        │
          ┌─────────────┴─────────────┐
          │   数据存储层                │
          │  - JSON 文件 (轻量级)       │
          │  - 可扩展至 MongoDB/MySQL  │
          └───────────────────────────┘
```

### 2.2 技术栈总览

| 层级 | 技术选型 | 版本 | 说明 |
|------|---------|------|------|
| **后端框架** | Express.js | 4.18+ | 轻量级 Node.js Web 框架 |
| **前端 Web** | Vue 3 + Vite | Vue 3.3 + Vite 5 | 现代化前端构建 |
| **UI 组件库** | Element Plus | 2.3+ | Vue 3 企业级组件库 |
| **小程序** | uni-app + Vue 3 | 3.0 | 一套代码多端发行 |
| **状态管理** | Pinia | 2.1+ | 小程序端使用（可选） |
| **HTTP 客户端** | Axios | 1.5+ | Web 前端和后端 AI 调用 |
| **测试框架** | Jest | 29.7+ | 后端服务层单元测试 |
| **部署** | Nginx + systemd | - | 生产环境部署方案 |
| **AI 接口** | OpenAI 兼容 API | - | 可接入任意兼容模型 |

### 2.3 项目目录结构

```
/workspace/
├── backend/                    # 后端服务
│   ├── config/                # 配置文件
│   │   └── index.js           # 端口、存储目录等配置
│   ├── controllers/           # 控制器层
│   │   ├── ai.js              # AI 相关接口
│   │   ├── job.js             # 岗位相关接口
│   │   └── resume.js          # 简历相关接口
│   ├── routes/                # 路由层
│   │   ├── ai.js              # /api/ai/*
│   │   ├── job.js             # /api/jobs/*
│   │   └── resume.js          # /api/resumes/*
│   ├── services/              # 业务服务层
│   │   ├── aiService.js       # AI Agent 服务
│   │   ├── jobService.js      # 岗位匹配服务
│   │   └── resumeService.js   # 简历数据服务
│   ├── data/                  # 数据存储（JSON 文件）
│   │   └── resumes.json
│   ├── tests/                 # 单元测试
│   │   ├── aiService.test.js
│   │   ├── jobService.test.js
│   │   └── resumeService.test.js
│   ├── jest.config.js         # Jest 配置
│   ├── package.json
│   └── server.js              # 服务入口
│
├── frontend/                   # Web 前端
│   ├── src/
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home.vue       # 首页/列表
│   │   │   ├── CreateResume.vue
│   │   │   ├── EditResume.vue
│   │   │   ├── PreviewResume.vue
│   │   │   └── JobMatch.vue
│   │   ├── router/            # 路由
│   │   ├── utils/             # 工具
│   │   │   └── api.js         # Axios 封装
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── miniprogram/                # 小程序
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index/
│   │   │   ├── resume/
│   │   │   └── job/
│   │   ├── styles/            # 全局样式
│   │   ├── utils/
│   │   │   └── api.ts         # uni.request 封装
│   │   ├── pages.json         # 页面路由配置
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── scripts/                    # 部署脚本与配置
│   ├── deploy.sh              # 一键部署脚本
│   ├── nginx.conf             # Nginx 配置
│   └── resume-backend.service # systemd 服务配置
│
├── DEPLOY.md                  # 详细部署指南
├── README.md                  # 项目说明文档
└── SUMMARY.md                 # 本文档
```

---

## 三、后端服务详解

### 3.1 服务分层设计

采用经典的三层架构：

```
HTTP Request
    ↓
Routes（路由层）  →  URL 分发、参数接收
    ↓
Controllers（控制层） → 请求处理、响应封装、错误处理
    ↓
Services（服务层） → 业务逻辑、数据处理
    ↓
Data Storage（数据层） → JSON 文件存储
```

### 3.2 服务入口 [server.js](file:///workspace/backend/server.js)

- 集成中间件：morgan（日志）、cors（跨域）、body-parser（请求体解析）
- 挂载三大路由模块：`/api/resumes`、`/api/jobs`、`/api/ai`
- 默认监听端口：`3000`（可通过环境变量 `PORT` 覆盖）

### 3.3 简历服务 [resumeService.js](file:///workspace/backend/services/resumeService.js)

#### 核心功能

| 方法 | 功能 | 返回值 |
|------|------|--------|
| `getAllResumes()` | 获取所有简历 | 简历数组 |
| `getResumeById(id)` | 根据 ID 获取单份简历 | 简历对象 / null |
| `createResume(data)` | 创建新简历 | 新简历对象（带 id、时间戳） |
| `updateResume(id, data)` | 更新简历 | 更新后简历对象 / null |
| `deleteResume(id)` | 删除简历 | boolean |
| `generateTargetedResume(id, jobDesc)` | 生成定向简历 | 优化后简历对象 |

#### 定向简历生成算法

1. **关键词提取**：从岗位描述中提取技术关键词（23 个）和软技能（6 个）
2. **经历排序**：根据关键词匹配次数为每条经历计算 `relevanceScore`，按相关度降序排列
3. **技能高亮**：匹配到关键词的技能标记 `highlighted: true`，并置顶排序
4. **附加信息**：添加 `keywords` 数组和 `optimizedAt` 时间戳

#### 数据存储

- 使用本地 JSON 文件存储（`backend/data/resumes.json`）
- 支持通过环境变量 `STORAGE_DIR` 自定义存储目录（测试隔离用）
- 生成唯一 ID 使用 `uuid` 库

### 3.4 岗位匹配服务 [jobService.js](file:///workspace/backend/services/jobService.js)

#### 核心功能

| 方法 | 功能 |
|------|------|
| `matchJob(resumeId, jobDescription)` | 计算简历与岗位的匹配度 |
| `analyzeJob(jobDescription)` | 分析岗位描述，提取关键词分类 |
| `getSuggestions()` | 获取预设岗位建议列表 |

#### 匹配度计算逻辑

```
matchScore = 简历中出现的关键词数量
maxScore   = min(关键词总数, 20)  # 上限 20 防止过多关键词稀释
percentage = round(matchScore / maxScore * 100)
```

#### 关键词分类体系

共 60+ 关键词，分三类：

- **技术栈**（30+）：Java、Python、JavaScript、React、Vue、Node.js、MySQL、Docker 等
- **软技能**（11 个）：团队协作、沟通能力、项目管理、问题解决、学习能力等
- **工具**（12 个）：Git、Linux、Jenkins、Webpack、Vite 等

#### 智能建议生成

根据匹配结果自动生成优化建议：
- 缺少关键词 → 建议补充相关技能描述
- 缺少工作经历 → 建议添加项目/实习经历
- 缺少教育背景 → 建议补充教育信息

### 3.5 AI 智能体服务 [aiService.js](file:///workspace/backend/services/aiService.js)

#### AIAgent 类设计

```javascript
class AIAgent {
  // 配置：从环境变量读取 API 地址、Key、模型
  constructor()

  // 核心方法
  async generateResume(basicInfo, education, experience, skills, projects, targetJob)
  async optimizeResume(resume, jobDescription)
  async analyzeJobDescription(jobDescription)
  async generateSummary(text)
  async generateBulletPoints(experience)

  // 内部方法
  buildResumePrompt(...)      // 构建简历生成提示词
  buildOptimizePrompt(...)     // 构建优化建议提示词
  buildJobAnalysisPrompt(...)  // 构建岗位分析提示词
  callAI(prompt)              // 调用 AI API
  parseResumeResponse(resp)   // 解析 AI 返回的 JSON
  generateMockResume(...)      // Mock 数据降级
  generateMockOptimization(...)
  generateMockJobAnalysis(...)
}
```

#### AI 能力清单

| 能力 | 输入 | 输出 | 说明 |
|------|------|------|------|
| 简历生成 | 基本信息 + 教育 + 经历 + 技能 + 项目 + 目标岗位 | 结构化简历 JSON | 包含摘要、核心竞争力、经历要点、技能亮点 |
| 简历优化 | 简历内容 + 岗位描述 | 优化建议文本 | 匹配度分析、内容优化、关键词建议、排版建议 |
| 岗位分析 | 岗位描述文本 | 结构化 JSON | 职位名称、必备技能、加分技能、职责、要求、难度、行业 |
| 文本摘要 | 任意文本 | 摘要文本 | 简洁总结 |
| 项目符号化 | 经历描述 | 要点列表 | 突出量化成果 |

#### 提示词工程策略

- **系统角色设定**：专业简历撰写和职业规划顾问
- **结构化输出**：要求 JSON 格式返回，便于程序解析
- **温度设置**：`temperature: 0.7`，平衡创造力和稳定性
- **中文优先**：所有提示词使用中文，输出中文结果

#### Mock 降级机制

当 AI API 不可用时（未配置 API Key 或调用失败），自动降级到本地 Mock 数据：

1. **简历生成 Mock**：基于输入信息生成模板化简历
2. **优化建议 Mock**：生成通用优化建议 + 从岗位描述提取的关键词
3. **岗位分析 Mock**：正则匹配常见技术关键词

> **设计意图**：保证前端功能始终可用，开发/测试阶段无需配置 AI 也能完整体验流程。

### 3.6 API 接口清单

所有接口前缀：`/api`

#### 简历管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/resumes` | 获取所有简历列表 |
| GET | `/resumes/:id` | 获取单份简历详情 |
| POST | `/resumes` | 创建新简历 |
| PUT | `/resumes/:id` | 更新简历 |
| DELETE | `/resumes/:id` | 删除简历 |
| POST | `/resumes/:id/generate` | 根据岗位描述生成定向简历 |

#### 岗位匹配

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/jobs/match` | 计算简历与岗位匹配度 |
| POST | `/jobs/analyze` | 分析岗位描述关键词 |
| GET | `/jobs/suggestions` | 获取预设岗位建议 |

#### AI 辅助

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/ai/generate` | AI 生成简历内容 |
| POST | `/ai/optimize` | AI 优化简历 |
| POST | `/ai/analyze-job` | AI 分析岗位描述 |
| POST | `/ai/summary` | AI 生成文本摘要 |
| POST | `/ai/bullet-points` | AI 生成经历要点 |

### 3.7 单元测试

测试框架：**Jest 29**

#### 测试覆盖

| 测试文件 | 覆盖服务 | 用例数 | 测试重点 |
|---------|---------|--------|---------|
| `resumeService.test.js` | resumeService | 12+ | CRUD 完整性、边界情况、定向生成逻辑 |
| `jobService.test.js` | jobService | 8+ | 关键词提取准确性、匹配度计算、错误处理 |
| `aiService.test.js` | aiService | - | Mock 降级、返回结构验证 |

#### 测试隔离策略

- 通过 `STORAGE_DIR` 环境变量指向系统临时目录
- 每个测试文件独立创建临时数据目录
- 测试结束后自动清理（`afterAll` 钩子）
- 完全不影响生产数据

#### 运行方式

```bash
cd backend
npm test              # 运行全部测试
npm run test:watch    # watch 模式
npm run test:coverage # 覆盖率报告
```

---

## 四、Web 前端详解

### 4.1 技术选型

- **框架**：Vue 3 (Composition API + `<script setup>`)
- **构建工具**：Vite 5
- **UI 组件库**：Element Plus
- **路由**：Vue Router 4 (History 模式)
- **HTTP 客户端**：Axios 1.5
- **CSS 预处理器**：Sass

### 4.2 页面清单

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 简历列表、快捷操作入口 |
| 创建简历 | `/create` | 填写各模块信息，AI 辅助生成 |
| 编辑简历 | `/edit/:id` | 修改已有简历 |
| 预览简历 | `/preview/:id` | 卡片式预览、支持打印 |
| 岗位匹配 | `/job-match` | 输入岗位描述、查看匹配度分析 |

### 4.3 AI 助手集成

在 [CreateResume.vue](file:///workspace/frontend/src/pages/CreateResume.vue) 页面内置 AI 助手面板：

**三大 AI 功能：**

1. ✍️ **生成个人简介** — 根据姓名、职位、技能自动生成专业的个人简介
2. 📋 **生成经历要点** — 将工作经历转换为结构化的项目符号列表
3. ✨ **优化简历内容** — 基于目标职位整体优化简历

**交互设计：**
- 页面右上角 "AI 助手" 按钮，点击展开/收起
- 渐变色紫色面板，视觉突出
- 点击功能卡片后自动调用接口并填充到表单
- 加载状态反馈

### 4.4 API 封装

[utils/api.js](file:///workspace/frontend/src/utils/api.js) 统一封装：

- `baseURL: '/api'`（相对路径，配合 Nginx 代理或 Vite dev proxy）
- 超时时间：10 秒
- 三个 API 对象：`resumeApi`、`jobApi`、`aiApi`
- 开发环境通过 Vite 代理转发到 `localhost:3000`

### 4.5 开发与构建

```bash
cd frontend
npm run dev      # 开发模式 (http://localhost:5173)
npm run build    # 生产构建 (输出到 dist/)
npm run preview  # 预览构建产物
```

---

## 五、小程序端详解

### 5.1 技术选型

- **框架**：uni-app 3.0 (Vue 3 + TypeScript)
- **状态管理**：Pinia 2.1
- **CSS 预处理器**：Sass
- **构建工具**：Vite 5

### 5.2 多端支持

| 平台 | 构建命令 | 输出目录 |
|------|---------|---------|
| H5 | `npm run dev:h5` | `dist/dev/h5` |
| H5 生产 | `npm run build:h5` | `dist/build/h5` |
| 微信小程序 | `npm run dev:mp-weixin` | `dist/dev/mp-weixin` |
| 微信小程序生产 | `npm run build:mp-weixin` | `dist/build/mp-weixin` |

### 5.3 页面结构

底部 TabBar 两个主入口：

1. **首页**（pages/index/index）
   - 项目介绍
   - 快捷入口：创建简历、编辑简历、预览简历、岗位匹配

2. **岗位匹配**（pages/job/match）
   - 岗位描述输入
   - 匹配度展示
   - 关键词分析

二级页面：
- `pages/resume/create` — 创建简历
- `pages/resume/edit` — 编辑简历
- `pages/resume/preview` — 预览简历

### 5.4 AI 助手

与 Web 端功能一致，适配移动端：
- 顶部 "AI助手" 入口按钮
- 展开式 AI 面板，三大功能卡片
- 点击后调用 `aiApi` 并自动填充
- 加载使用 `uni.showLoading`

### 5.5 API 配置

[utils/api.ts](file:///workspace/miniprogram/src/utils/api.ts)：

- 开发环境：`http://localhost:3000/api`
- 生产环境：`http://YOUR_SERVER_IP:3000/api`（需手动配置）
- 自动根据 `NODE_ENV` 切换
- 基于 `uni.request` 封装

> ⚠️ 微信小程序注意事项：
> - 需在微信公众平台配置 request 合法域名
> - 生产环境必须使用 HTTPS
> - 开发阶段可在开发者工具中开启 "不校验合法域名"

---

## 六、部署方案

### 6.1 部署架构

```
用户浏览器/小程序
       │
       ▼
   Nginx (80/443)
       ├─ 静态文件服务 → /opt/resume-generator/frontend/
       └─ /api/* 反向代理 → Node.js (127.0.0.1:3000)
                          └─ systemd 守护进程管理
```

### 6.2 部署脚本 [scripts/deploy.sh](file:///workspace/scripts/deploy.sh)

一键部署，五大步骤：

| 步骤 | 操作 |
|------|------|
| 1 | 检查 Node.js 环境 |
| 2 | 安装后端和前端依赖 |
| 3 | 构建前端生产包 |
| 4 | 打包部署包（后端源码 + 前端构建产物 + 配置文件） |
| 5 | 可选：自动上传到服务器并执行安装 |

**使用方式：**
```bash
chmod +x scripts/deploy.sh
# 修改脚本顶部的 SERVER_HOST / SERVER_USER
./scripts/deploy.sh
```

### 6.3 Nginx 配置 [scripts/nginx.conf](file:///workspace/scripts/nginx.conf)

核心特性：
- 静态资源 30 天缓存
- 前端 SPA 路由支持（`try_files $uri /index.html`）
- API 反向代理（带完整的 proxy 头）
- 健康检查端点 `/health`
- 可选 HTTPS 配置（模板已提供）

### 6.4 systemd 服务 [scripts/resume-backend.service](file:///workspace/scripts/resume-backend.service)

特性：
- 自动重启（`Restart=always`，间隔 10 秒）
- 安全沙箱（ProtectSystem、PrivateTmp、ProtectHome）
- 日志接入 journald
- 开机自启（`WantedBy=multi-user.target`）

**常用命令：**
```bash
sudo systemctl start resume-backend     # 启动
sudo systemctl stop resume-backend      # 停止
sudo systemctl restart resume-backend   # 重启
sudo systemctl status resume-backend    # 状态
sudo journalctl -u resume-backend -f    # 实时日志
```

### 6.5 详细部署文档

完整部署指南见 [DEPLOY.md](file:///workspace/DEPLOY.md)，包含：
- 服务器要求
- 快速开始
- 分步详解
- 日常运维命令
- 故障排查指南
- 小程序部署说明
- 安全建议
- 性能优化建议

---

## 七、关键技术决策

### 7.1 数据存储为什么用 JSON 文件？

**原因：**
1. 项目定位是轻量级工具，初期用户量小
2. 零依赖，开箱即用，无需安装数据库
3. 便于迁移和备份（一个文件搞定）
4. 代码简单，易于理解和二次开发

**扩展方案：**
如果后续需要支持多用户、高并发，可以：
- 替换为 MongoDB（文档型，与 JSON 结构天然契合）
- 或 MySQL（关系型，适合复杂查询）
- 只需修改 `resumeService.js` 的数据访问层，上层代码无需改动

### 7.2 为什么选择 Express 而不是 Koa / NestJS？

| 框架 | 选择理由 |
|------|---------|
| Express | ✅ 最成熟、生态最丰富、学习成本最低、轻量 |
| Koa | 更现代，但生态稍弱，async 处理优势在本项目不明显 |
| NestJS | 企业级架构，对于小型项目过重 |

### 7.3 AI 服务为什么做成可降级的？

1. **开发体验**：开发者无需配置 API Key 就能完整体验
2. **演示友好**：产品演示时不依赖外部网络
3. **容错保障**：AI 服务挂了不影响核心简历管理功能
4. **成本控制**：可根据需要选择是否启用真实 AI

### 7.4 为什么用 uni-app 做小程序？

- 一套代码，同时支持 H5 和微信小程序（甚至更多平台）
- 基于 Vue 3，与 Web 端技术栈一致，降低学习成本
- 生态成熟，组件丰富
- 对于本项目的简历场景，uni-app 完全满足需求

---

## 八、讨论纪要与演进路径

### 8.1 需求讨论时间线

**第一阶段：项目初始化**
- 需求：简历生成项目，面向毕业生
- 产出：项目骨架、后端 CRUD、前端基础页面

**第二阶段：岗位匹配**
- 需求：支持基于特定岗位生成针对性简历
- 产出：岗位匹配算法、关键词提取、定向简历生成
- 关键决策：使用关键词匹配算法（而非复杂 NLP），保证速度和可解释性

**第三阶段：AI 接入**
- 需求：接入 AI，内置 agent 协助动态生成
- 产出：AIAgent 类、五大 AI 能力、Mock 降级机制
- 关键决策：OpenAI 兼容协议，支持任意大模型接入；内置 Mock 保证可用性
- 前端集成：AI 助手面板，三大一键生成功能

**第四阶段：多端与部署**
- 需求：做成小程序和 Web 应用 + 部署到服务器
- 产出：uni-app 小程序端、部署脚本、Nginx/systemd 配置
- 关键决策：uni-app 跨端方案、一键部署脚本

**第五阶段：质量保障**
- 需求：单元测试确保没有问题
- 产出：Jest 测试框架、服务层单元测试、测试隔离机制
- 关键决策：重点覆盖服务层业务逻辑，保证核心算法正确性

### 8.2 已完成的功能清单

✅ 后端服务
- ✅ 简历 CRUD（基于 JSON 文件存储）
- ✅ 岗位描述关键词提取
- ✅ 简历-岗位匹配度计算
- ✅ 定向简历生成（经历排序、技能高亮）
- ✅ AI Agent（5 大 AI 能力 + Mock 降级）
- ✅ RESTful API 接口（14 个）
- ✅ Jest 单元测试（服务层）
- ✅ CORS 跨域支持

✅ Web 前端
- ✅ 首页 / 简历列表
- ✅ 创建简历（完整表单）
- ✅ 编辑简历
- ✅ 预览简历（打印样式）
- ✅ 岗位匹配分析
- ✅ AI 助手面板（3 大功能）
- ✅ Element Plus UI 组件
- ✅ Vue Router 路由

✅ 小程序端
- ✅ 首页 + TabBar
- ✅ 创建/编辑/预览简历
- ✅ 岗位匹配
- ✅ AI 助手
- ✅ uni-app 跨端（H5 + 微信小程序）
- ✅ TypeScript 支持

✅ 部署与运维
- ✅ 一键部署脚本
- ✅ Nginx 反向代理配置
- ✅ systemd 服务配置
- ✅ 详细部署文档 (DEPLOY.md)
- ✅ 故障排查指南

### 8.3 后续可扩展方向

1. **数据库升级**：JSON → MongoDB / MySQL，支持多用户
2. **用户系统**：注册登录、个人中心、多简历管理
3. **模板市场**：多种简历模板，一键切换样式
4. **PDF 导出**：前端 html2canvas + jsPDF 或后端 Puppeteer
5. **AI 能力增强**：
   - 简历打分（多维度）
   - 智能问答（AI 解答求职问题）
   - 批量岗位投递分析
6. **小程序增强**：
   - 微信登录
   - 分享海报
   - 消息推送
7. **管理后台**：数据统计、用户管理、内容审核
8. **性能优化**：
   - 前端代码分割
   - 接口缓存
   - CDN 加速

---

## 九、快速上手指南

### 9.1 3 分钟跑起来

```bash
# 1. 启动后端
cd backend && npm install && npm start
# 访问 http://localhost:3000 验证

# 2. 启动前端（新开终端）
cd frontend && npm install && npm run dev
# 访问 http://localhost:5173

# 3. 运行单元测试
cd backend && npm test
```

### 9.2 核心文件速查

| 想修改什么 | 去哪个文件 |
|-----------|-----------|
| 后端端口 / 存储路径 | `backend/config/index.js` |
| API 接口返回格式 | `backend/controllers/*.js` |
| 业务逻辑 / 算法 | `backend/services/*.js` |
| 前端页面 | `frontend/src/pages/*.vue` |
| 前端接口调用 | `frontend/src/utils/api.js` |
| 小程序页面 | `miniprogram/src/pages/` |
| 小程序接口地址 | `miniprogram/src/utils/api.ts` |
| AI 提示词 / Mock 逻辑 | `backend/services/aiService.js` |
| 关键词库 | `backend/services/jobService.js` + `resumeService.js` |
| 部署配置 | `scripts/deploy.sh`、`scripts/nginx.conf` |

---

## 十、附录

### 10.1 环境变量清单

后端支持以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 3000 | 服务监听端口 |
| `STORAGE_DIR` | `./data` | 数据存储目录（相对 backend/） |
| `AI_API_URL` | `https://api.openai.com/v1` | AI API 地址 |
| `AI_API_KEY` | （空） | AI API 密钥 |
| `AI_MODEL` | `gpt-3.5-turbo` | AI 模型名称 |
| `NODE_ENV` | - | 运行环境（production/development） |

### 10.2 相关文档

- [README.md](file:///workspace/README.md) — 项目介绍与快速开始
- [DEPLOY.md](file:///workspace/DEPLOY.md) — 详细部署指南
- [backend/package.json](file:///workspace/backend/package.json) — 后端依赖与脚本
- [frontend/package.json](file:///workspace/frontend/package.json) — 前端依赖与脚本
- [miniprogram/package.json](file:///workspace/miniprogram/package.json) — 小程序依赖与脚本

---

*文档结束*
