#!/bin/bash
# ============================================================
# 简历生成器项目部署脚本
# 功能：打包项目、上传到服务器、自动部署
# ============================================================

set -e

# ========== 配置区 ==========
SERVER_HOST="your-server-ip"          # 服务器地址，例如: 192.168.1.100
SERVER_USER="root"                     # 服务器用户名
SERVER_PATH="/opt/resume-generator"    # 服务器部署路径
BACKEND_PORT=3000                      # 后端端口
FRONTEND_PORT=8080                     # 前端端口
# =============================

echo "========================================"
echo "  简历生成器 - 部署脚本"
echo "========================================"

# 步骤 1: 检查 Node.js 环境
echo ""
echo "[1/5] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 16+"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    exit 1
fi
echo "✓ Node.js 版本: $(node --version)"
echo "✓ npm 版本: $(npm --version)"

# 步骤 2: 安装依赖
echo ""
echo "[2/5] 安装项目依赖..."

echo "  → 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install --production
fi
cd ..
echo "    ✓ 后端依赖完成"

echo "  → 安装前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..
echo "    ✓ 前端依赖完成"

# 步骤 3: 构建前端
echo ""
echo "[3/5] 构建前端项目..."
cd frontend
npm run build
cd ..
echo "✓ 前端构建完成"

# 步骤 4: 准备部署包
echo ""
echo "[4/5] 准备部署包..."

DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR/backend"
mkdir -p "$DEPLOY_DIR/frontend"

# 复制后端代码
cp -r backend/* "$DEPLOY_DIR/backend/"
rm -rf "$DEPLOY_DIR/backend/node_modules"
echo "    ✓ 后端代码已复制"

# 复制前端构建文件
if [ -d "frontend/dist" ]; then
    cp -r frontend/dist/* "$DEPLOY_DIR/frontend/"
else
    echo "⚠ 警告: 未找到前端构建目录 frontend/dist"
fi
echo "    ✓ 前端构建文件已复制"

# 复制部署配置
mkdir -p "$DEPLOY_DIR/config"
cp scripts/nginx.conf "$DEPLOY_DIR/config/" 2>/dev/null || true
cp scripts/resume-backend.service "$DEPLOY_DIR/config/" 2>/dev/null || true
cp scripts/setup-server.sh "$DEPLOY_DIR/" 2>/dev/null || true

# 生成安装脚本
cat > "$DEPLOY_DIR/install.sh" << 'INSTALL_EOF'
#!/bin/bash
set -e
echo "========================================"
echo "  在服务器上执行安装"
echo "========================================"

# 创建目录
sudo mkdir -p /opt/resume-generator
sudo cp -r backend /opt/resume-generator/
sudo cp -r frontend /opt/resume-generator/

# 安装后端依赖
cd /opt/resume-generator/backend
sudo npm install --production

# 复制配置
if [ -f "config/resume-backend.service" ]; then
    sudo cp config/resume-backend.service /etc/systemd/system/
    sudo systemctl daemon-reload
    echo "✓ systemd 服务已配置"
fi

echo ""
echo "✓ 安装完成！"
echo "  启动后端: sudo systemctl start resume-backend"
echo "  查看状态: sudo systemctl status resume-backend"
echo "  前端文件位于: /opt/resume-generator/frontend/"
INSTALL_EOF
chmod +x "$DEPLOY_DIR/install.sh"

# 打包
tar -czvf "$DEPLOY_DIR.tar.gz" "$DEPLOY_DIR"
echo "✓ 部署包已生成: $DEPLOY_DIR.tar.gz"

# 步骤 5: 上传到服务器（如果配置了服务器信息）
echo ""
echo "[5/5] 上传到服务器..."

if [ "$SERVER_HOST" != "your-server-ip" ] && [ "$SERVER_HOST" != "" ]; then
    echo "  → 上传部署包到 $SERVER_USER@$SERVER_HOST:$SERVER_PATH"
    if command -v scp &> /dev/null; then
        scp "$DEPLOY_DIR.tar.gz" "$SERVER_USER@$SERVER_HOST:/tmp/"
        echo "  → 在服务器上解压并安装..."
        ssh "$SERVER_USER@$SERVER_HOST" "cd /tmp && tar -xzvf $DEPLOY_DIR.tar.gz && cd $DEPLOY_DIR && ./install.sh"
        echo "✓ 部署完成！"
    else
        echo "⚠ 未检测到 scp 命令，请手动上传 $DEPLOY_DIR.tar.gz 到服务器"
    fi
else
    echo ""
    echo "========================================"
    echo "  ⚠ 请配置服务器信息后自动上传"
    echo "  或手动执行以下步骤："
    echo ""
    echo "  1. 上传 $DEPLOY_DIR.tar.gz 到服务器"
    echo "  2. 在服务器上解压: tar -xzvf $DEPLOY_DIR.tar.gz"
    echo "  3. 进入目录并执行: ./install.sh"
    echo "========================================"
fi

echo ""
echo "✓ 部署流程完成"
echo "  部署包位置: $(pwd)/$DEPLOY_DIR.tar.gz"
