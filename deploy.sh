#!/bin/bash

PROJECT_DIR="/path/to/Vertical-Bio-Design-for-Webcam-Model"
cd $PROJECT_DIR || exit 1

echo "🚀 Начинаю деплой на продакшен..."

# 1. Обновляем код
echo "📥 Git pull..."
git reset --hard
git pull origin main

# 2. Устанавливаем зависимости (если добавились новые)
echo "📦 Установка зависимостей..."
npm install

# 3. Собираем фронт (создается папка dist/)
echo "🔨 Сборка проекта..."
npm run build

# 4. Проверяем что dist создана
if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не создана!"
    exit 1
fi

# 5. Перезапускаем только бэкенд (он раздает статику)
echo "🔄 Перезапуск сервера..."
pm2 restart bio-server || pm2 start server/index.js --name "bio-server"

# 6. Сохраняем конфигурацию PM2
pm2 save

echo "✅ Деплой завершен!"
echo "🌐 Сайт доступен на http://$(hostname -I | awk '{print $1}'):3000"
