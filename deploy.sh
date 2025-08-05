#!/bin/bash

# 部署腳本 - 自動化gh-pages部署

echo "🚀 開始部署流程..."

# 1. 確保在main分支
echo "📋 檢查分支..."
if [[ $(git branch --show-current) != "main" ]]; then
    echo "❌ 請在main分支執行部署"
    exit 1
fi

# 2. 檢查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ 有未提交的更改，請先提交"
    git status
    exit 1
fi

# 3. 構建專案
echo "🔨 構建專案..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 構建失敗"
    exit 1
fi

# 4. 切換到gh-pages分支
echo "🔄 切換到gh-pages分支..."
git checkout gh-pages

# 5. 清空並複製新文件
echo "📁 更新文件..."
rm -rf *
cp -r ../dist/* . 2>/dev/null || cp -r dist/* .

# 6. 提交更改
echo "💾 提交更改..."
git add .
git commit -m "update gh-pages $(date)"

# 7. 推送到遠端
echo "📤 推送到GitHub..."
git push origin gh-pages

# 8. 切換回main分支
echo "🔄 切換回main分支..."
git checkout main

echo "✅ 部署完成！"
echo "🌐 請等待幾分鐘後訪問: https://hsuhsusophie.github.io/Money-Manager/" 