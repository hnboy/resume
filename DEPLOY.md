# 简历生成器 - 完整部署指南

> 适用于将项目部署到 zzws 服务器或其他 Linux 服务器

---

## 目录

1. [快速开始（5 分钟完成）](#快速开始)
2. [服务器要求](#服务器要求)
3. [部署步骤详解](#部署步骤详解)
4. [本地打包方式](#本地打包方式)
5. [服务器手动部署方式](#服务器手动部署方式)
6. [日常运维命令](#日常运维命令)
7. [故障排查](#故障排查)

---

## 服务器要求

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 操作系统 | Ubuntu 18.04 / CentOS 7 | Ubuntu 20.04+ / CentOS 8+ |
| CPU | 1 核 | 2 核+ |
| 内存 | 2 GB | 4 GB+ |
| 硬盘 | 10 GB | 20 GB+ |
| Node.js | v14+ | v18+ |
| Nginx | 1.14+ | 1.18+ |

---

## 快速开始

### 方式一：一键部署（推荐）

在本地项目根目录执行：

```bash
# 进入项目目录
cd /workspace

# 给脚本执行权限
chmod +x scripts/deploy.sh

# 编辑脚本，修改顶部的服务器配置
vim scripts/deploy.sh
# 修改 SERVER_HOST 为您的服务器 IP，例如: 192.168.1.100
# 修改 SERVER_USER 为您的服务器用户名，例如: root

# 运行部署脚本
./scripts/deploy.sh
```

脚本会自动完成以下工作：
1. ✅ 检查本地 Node.js 环境
2. ✅ 安装项目依赖
3. ✅ 构建前端项目
4. ✅ 打包部署文件
5. ✅ 上传到服务器并自动安装

---

### 方式二：分步手动部署

如果您需要更细粒度的控制，请按照以下步骤操作。

---

## 部署步骤详解

### 第一步：在本地打包项目

```bash
cd /workspace

# 1. 安装后端依赖
cd backend
npm install --production
cd ..

# 2. 安装前端依赖并构建
cd frontend
npm install
npm run build
cd ..

# 3. 准备部署目录
mkdir -p deploy/backend
mkdir -p deploy/frontend

# 4. 复制后端代码（排除 node_modules 以减少体积）
cp -r backend/* deploy/backend/
rm -rf deploy/backend/node_modules

# 5. 复制前端构建文件
if [ -d "frontend/dist" ]; then
    cp -r frontend/dist/* deploy/frontend/
else
    echo "⚠ 前端构建失败，请检查错误"
    exit 1
fi

# 6. 复制部署配置文件
mkdir -p deploy/config
cp scripts/nginx.conf deploy/config/
cp scripts/resume-backend.service deploy/config/

# 7. 打包压缩
tar -czvf resume-generator-deploy.tar.gz deploy/

echo "✅ 打包完成！文件: resume-generator-deploy.tar.gz"
```

---

### 第二步：上传部署包到服务器

**方式 A：使用 SCP 上传**

```bash
# 格式: scp 本地文件 用户@服务器IP:服务器路径
scp resume-generator-deploy.tar.gz root@服务器IP:/tmp/

# 示例:
scp resume-generator-deploy.tar.gz root@192.168.1.100:/tmp/
```

**方式 B：使用 SFTP 工具**
- FileZilla、WinSCP 等图形化工具
- 上传到服务器的 `/tmp/` 目录

**方式 C：在服务器直接克隆 Git 仓库**

```bash
# 登录服务器后
cd /opt
git clone <您的代码仓库地址> resume-generator
cd resume-generator
# 然后跳过第三步，直接进行第四步的服务器环境配置
```

---

### 第三步：在服务器上解压

```bash
# SSH 登录服务器
ssh root@服务器IP

# 进入临时目录并解压
cd /tmp
tar -xzvf resume-generator-deploy.tar.gz
ls deploy/
# 应该看到: backend/  frontend/  config/
```

---

### 第四步：配置服务器环境（首次部署必须执行）

#### 4.1 检查并安装 Node.js

```bash
# 检查 Node.js 版本
node --version

# 如果未安装或版本低于 v14，请执行：

# Ubuntu/Debian 系统:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL 系统:
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version   # 应输出 v18.x.x
npm --version    # 应输出 9.x.x
```

#### 4.2 检查并安装 Nginx（可选，用于生产环境）

```bash
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y nginx

# CentOS/RHEL:
sudo yum install -y epel-release
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证
nginx -v
```

---

### 第五步：安装后端

```bash
# 创建部署目录
sudo mkdir -p /opt/resume-generator
cd /tmp/deploy

# 复制后端代码
sudo cp -r backend /opt/resume-generator/

# 安装后端依赖
cd /opt/resume-generator/backend
sudo npm install --production

# 验证后端能启动（测试几秒后用 Ctrl+C 停止）
sudo npm start
# 应该看到: 服务器运行在 http://localhost:3000
# 测试通过后按 Ctrl+C 停止
```

---

### 第六步：安装前端

```bash
cd /tmp/deploy

# 复制前端构建文件
sudo cp -r frontend /opt/resume-generator/

# 验证文件
ls -la /opt/resume-generator/frontend/
# 应该看到: index.html, assets/ 等文件
```

---

### 第七步：配置后端为系统服务（推荐）

使用 systemd 管理后端服务，可以实现开机自启、异常自动重启等功能。

```bash
cd /tmp/deploy

# 复制 systemd 服务配置文件
sudo cp config/resume-backend.service /etc/systemd/system/

# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start resume-backend

# 设置开机自启
sudo systemctl enable resume-backend

# 查看服务状态
sudo systemctl status resume-backend
# 应该看到 active (running)

# 查看运行日志
sudo journalctl -u resume-backend -f
```

---

### 第八步：配置 Nginx 反向代理（推荐用于生产环境）

```bash
cd /tmp/deploy

# 复制 Nginx 配置
sudo cp config/nginx.conf /etc/nginx/conf.d/resume-generator.conf

# 测试配置是否正确
sudo nginx -t
# 应该看到: test is successful

# 重新加载 Nginx
sudo systemctl reload nginx
```

**Nginx 配置说明：**
- 访问 `http://服务器IP/` → 前端页面
- 访问 `http://服务器IP/api/*` → 后端 API（转发到 localhost:3000）

---

### 第九步：验证部署

在浏览器或通过命令行验证：

```bash
# 测试后端 API
curl http://服务器IP:3000/
# 应返回: {"message":"简历生成器后端服务运行中"}

# 测试 Nginx 代理的 API
curl http://服务器IP/api/
# 应返回同样的结果

# 测试前端页面（在浏览器中访问）
# 打开 http://服务器IP/ 应该看到简历生成器前端页面
```

---

## 本地打包方式（完整脚本）

您也可以将以下内容保存为 `deploy.sh`，然后一键执行：

```bash
#!/bin/bash
set -e

echo "========================================"
echo "  简历生成器 - 本地打包脚本"
echo "========================================"

# 1. 安装依赖
echo ""
echo "[1/4] 安装依赖..."
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
echo "✓ 依赖安装完成"

# 2. 构建前端
echo ""
echo "[2/4] 构建前端..."
cd frontend && npm run build && cd ..
echo "✓ 前端构建完成"

# 3. 准备部署包
echo ""
echo "[3/4] 准备部署包..."
rm -rf deploy
mkdir -p deploy/backend deploy/frontend deploy/config
cp -r backend/* deploy/backend/
rm -rf deploy/backend/node_modules
cp -r frontend/dist/* deploy/frontend/
cp scripts/nginx.conf deploy/config/
cp scripts/resume-backend.service deploy/config/
echo "✓ 文件已准备"

# 4. 打包
echo ""
echo "[4/4] 打包压缩..."
tar -czvf resume-generator-$(date +%Y%m%d).tar.gz deploy/
echo "✓ 打包完成"

echo ""
echo "========================================"
echo "  部署包位置: $(pwd)/resume-generator-$(date +%Y%m%d).tar.gz"
echo "  上传命令: scp resume-generator-$(date +%Y%m%d).tar.gz root@服务器IP:/tmp/"
echo "========================================"
```

---

## 日常运维命令

### 查看后端服务状态
```bash
sudo systemctl status resume-backend
```

### 查看后端运行日志
```bash
# 实时查看
sudo journalctl -u resume-backend -f

# 查看最近 50 行
sudo journalctl -u resume-backend -n 50
```

### 重启后端服务
```bash
sudo systemctl restart resume-backend
```

### 停止后端服务
```bash
sudo systemctl stop resume-backend
```

### 不使用 systemd，手动启动后端（用于调试）
```bash
cd /opt/resume-generator/backend

# 方式一：前台启动（关闭终端会停止）
npm start

# 方式二：后台启动（使用 nohup）
nohup npm start > /var/log/resume-backend.log 2>&1 &
# 查看日志: tail -f /var/log/resume-backend.log
# 停止服务: ps aux | grep "node server.js" | grep -v grep | awk '{print $2}' | xargs kill -9

# 方式三：使用 pm2（推荐，如果不想用 systemd）
sudo npm install -g pm2
pm2 start server.js --name resume-backend
pm2 save
pm2 startup    # 生成开机自启命令
```

### Nginx 相关命令
```bash
# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 更新部署（已有项目更新代码后）

```bash
# 1. 在本地重新打包
cd /workspace
./scripts/deploy.sh

# 2. 上传新部署包到服务器
scp resume-generator-XXXX.tar.gz root@服务器IP:/tmp/

# 3. 在服务器上操作
ssh root@服务器IP
cd /tmp
tar -xzvf resume-generator-XXXX.tar.gz

# 4. 停止后端
sudo systemctl stop resume-backend

# 5. 替换文件
sudo rm -rf /opt/resume-generator/backend/*
sudo rm -rf /opt/resume-generator/frontend/*
sudo cp -r /tmp/deploy/backend/* /opt/resume-generator/backend/
sudo cp -r /tmp/deploy/frontend/* /opt/resume-generator/frontend/

# 6. 重新安装后端依赖（如果依赖有变化）
cd /opt/resume-generator/backend
sudo npm install --production

# 7. 启动后端
sudo systemctl start resume-backend

# 8. 检查状态
sudo systemctl status resume-backend
curl http://localhost:3000/
```

---

## 故障排查

### 问题 1：无法访问前端页面

**症状：** 浏览器访问服务器 IP 显示 "无法访问此网站"

**排查步骤：**
```bash
# 检查 Nginx 是否运行
sudo systemctl status nginx

# 检查防火墙
sudo ufw status        # Ubuntu
sudo firewall-cmd --list-all   # CentOS

# 开放 80 端口（如需要）
sudo ufw allow 80/tcp
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# 检查 Nginx 配置
sudo nginx -t
sudo cat /etc/nginx/conf.d/resume-generator.conf

# 检查前端文件是否存在
ls -la /opt/resume-generator/frontend/
```

---

### 问题 2：前端能访问，但 API 请求失败

**症状：** 页面能打开，但操作时提示网络错误或 API 失败

**排查步骤：**
```bash
# 检查后端服务状态
sudo systemctl status resume-backend

# 检查后端日志
sudo journalctl -u resume-backend -n 100

# 直接测试后端
curl http://localhost:3000/
curl http://localhost:3000/api/resumes

# 检查 Nginx 代理配置
sudo cat /etc/nginx/conf.d/resume-generator.conf
# 确认有 location /api/ 配置

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

---

### 问题 3：后端启动失败，提示端口被占用

**症状：** `systemctl status resume-backend` 显示错误，或日志中有 "EADDRINUSE"

**排查步骤：**
```bash
# 查找占用 3000 端口的进程
sudo lsof -i :3000
# 或
sudo netstat -tlnp | grep 3000

# 杀掉占用进程（PID 为上一步查到的进程号）
sudo kill -9 <PID>

# 重启后端
sudo systemctl restart resume-backend
```

---

### 问题 4：npm install 失败

**症状：** 安装依赖时报错或卡住

**解决方案：**
```bash
# 切换到国内镜像源（推荐）
npm config set registry https://registry.npmmirror.com

# 清理缓存后重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 或者使用 cnpm
sudo npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

---

### 问题 5：前端构建失败

**症状：** `npm run build` 报错

**常见原因：**
1. Node.js 版本过低（需要 v14+）
2. 依赖未正确安装

**解决方案：**
```bash
# 检查 Node 版本
node --version

# 重新安装依赖
cd frontend
rm -rf node_modules package-lock.json
npm install

# 清理 Vite 缓存后重新构建
rm -rf node_modules/.vite
npm run build
```

---

## 小程序部署说明

### H5 版本（网页版小程序）
```bash
# 在本地构建
cd miniprogram
npm install
npm run build:h5

# 将构建产物上传到服务器
# 默认输出目录: miniprogram/dist/build/h5/
# 可以放到 /opt/resume-generator/miniprogram-h5/ 下
# 然后在 Nginx 配置中添加路由
```

### 微信小程序版本
```bash
# 在本地构建
cd miniprogram
npm install
npm run build:mp-weixin

# 使用微信开发者工具打开:
# miniprogram/dist/build/mp-weixin/
# 在开发者工具中上传代码到微信公众平台

# ⚠ 注意：
# 1. 必须在微信公众平台配置服务器域名（request 合法域名）
# 2. API 地址必须使用 HTTPS（生产环境）
# 3. 修改 miniprogram/src/utils/api.ts 中的 PROD_BASE_URL 为实际地址
```

### 修改小程序 API 地址

编辑文件：`miniprogram/src/utils/api.ts`

```typescript
// 将 YOUR_SERVER_IP 替换为实际服务器地址
const PROD_BASE_URL = 'http://192.168.1.100:3000/api'
// 或使用 HTTPS
const PROD_BASE_URL = 'https://resume.example.com/api'
```

---

## 目录结构说明

部署完成后，服务器上的目录结构：

```
/opt/resume-generator/
├── backend/                    # 后端服务
│   ├── server.js              # 入口文件
│   ├── package.json
│   ├── node_modules/          # 运行时依赖
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── data/                  # 数据存储（JSON 文件）
│
├── frontend/                   # 前端静态文件
│   ├── index.html
│   └── assets/                # JS、CSS、图片等资源
│
└── miniprogram-h5/            # （可选）小程序 H5 版本
    ├── index.html
    └── static/
```

---

## 安全建议（生产环境必看）

### 1. 配置 HTTPS
```bash
# 使用 Let's Encrypt 免费证书
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 或使用已购买的证书，修改 nginx.conf 中的 SSL 配置
```

### 2. 配置防火墙
```bash
# Ubuntu
sudo ufw enable
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
# 生产环境不建议开放 3000 端口，所有请求通过 Nginx 转发

# CentOS
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 修改默认配置
- 修改后端默认端口（3000）或使用防火墙限制
- 为数据目录设置正确的权限
- 定期更新 Node.js 和依赖包

---

## 性能优化建议

1. **启用 Gzip 压缩**：在 Nginx 配置中添加 `gzip on;`
2. **启用静态资源缓存**：当前 Nginx 配置已包含 30 天缓存
3. **使用 CDN**：将前端静态文件放到 CDN 上
4. **数据库升级**：当前使用 JSON 文件存储，高并发场景建议切换到 MongoDB 或 MySQL

---

## 常见问题速查

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 502 Bad Gateway | 后端未启动 | `sudo systemctl start resume-backend` |
| 504 Gateway Timeout | 后端响应慢 | 检查后端日志，可能是数据量大或 AI API 慢 |
| 404 Not Found | 路由错误 | 检查 Nginx 配置和文件路径 |
| 403 Forbidden | 文件权限问题 | `sudo chmod -R 755 /opt/resume-generator` |
| CORS 错误 | 跨域配置 | 后端已配置 cors()，无需额外操作 |

---

## 技术支持

如遇到文档未覆盖的问题，请检查：
1. 后端日志：`sudo journalctl -u resume-backend -n 100`
2. Nginx 日志：`sudo tail -f /var/log/nginx/error.log`
3. Node.js 版本：`node --version`（建议 v18+）

---

**部署成功后，您可以通过以下方式访问：**
- 前端页面：`http://服务器IP/`
- 后端 API：`http://服务器IP/api/*`
- 健康检查：`http://服务器IP/health`
