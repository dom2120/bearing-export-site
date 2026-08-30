#!/bin/bash
# ============================================
# Bearing Export B2B Website - Production Start Script
# ============================================

set -e

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# 加载环境变量
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 默认值
PORT=${PORT:-3000}
NODE_ENV=${NODE_ENV:-production}

echo "============================================"
echo "  Bearing Export B2B Website"
echo "  Starting production server..."
echo "============================================"
echo "  Project: $PROJECT_DIR"
echo "  Port:    $PORT"
echo "  Env:     $NODE_ENV"
echo "============================================"

# 检查构建产物
if [ ! -d "dist/server" ]; then
  echo "[ERROR] Build output not found. Please run: npm run build"
  exit 1
fi

# 启动服务
exec node dist/server/main.js
