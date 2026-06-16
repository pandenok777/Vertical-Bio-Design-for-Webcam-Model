#!/bin/bash

# Автоматически находит папку проекта относительно скрипта
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR" || exit 1

echo "🚀 Деплой из: $PROJECT_DIR"

echo "📥 Git pull..."
git reset --hard
git pull origin main

echo "📦 Установка зависимостей..."
npm install

echo "🔨 Сборка..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: dist не создана!"
    exit 1
fi

echo "🔄 Перезапуск..."
pm2 restart bio-server || pm2 start server/index.cjs --name "bio-server"
pm2 save

echo "✅ Готово! http://$(hostname -I | awk '{print $1}'):3000"
