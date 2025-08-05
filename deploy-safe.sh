#!/bin/bash

echo "🚀 開始安全部署流程..."

# 1. 確保在main分支
echo "📋 檢查分支..."
if [[ $(git branch --show-current) != "main" ]]; then
    echo "❌ 請在main分支執行部署"
    exit 1
fi

# 2. 安裝依賴
echo "📦 安裝依賴..."
npm install

# 3. 構建專案
echo "🔨 構建專案..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 構建失敗"
    exit 1
fi

# 4. 提交main分支
echo "💾 提交main分支..."
git add .
git commit -m "update $(date)"
git push origin main

# 5. 切換到gh-pages分支
echo "🔄 切換到gh-pages分支..."
git checkout gh-pages

# 6. 複製構建文件
echo "📁 複製構建文件..."
cp -r ../dist/* .

# 7. 清理文件
echo "🧹 清理文件..."
rm -rf dist node_modules .vite

# 8. 提交gh-pages分支
echo "💾 提交gh-pages分支..."
git add .
git commit -m "update gh-pages $(date)"

# 9. 推送到GitHub
echo "📤 推送到GitHub..."
git push origin gh-pages

# 10. 切換回main分支
echo "🔄 切換回main分支..."
git checkout main

echo "✅ 部署完成！"
echo "🌐 請等待幾分鐘後訪問: https://hsuhsusophie.github.io/Money-Manager/" 