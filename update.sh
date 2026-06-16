#!/bin/bash

# Автоопределение пути к проекту (где лежит скрипт)
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "🚀 Обновление проекта в: $PROJECT_DIR"
echo "⏰ $(date)"

# Сохраняем скрипт на всякий случай
cp "$0" /tmp/update_backup.sh 2>/dev/null

# Сброс локальных изменений
git checkout .
git reset --hard
git clean -fd

# Pull с GitHub
echo "📥 Скачивание изменений..."
if ! git pull origin main; then
    echo "❌ Ошибка git pull"
    exit 1
fi

# Восстанавливаем скрипт
mv /tmp/update_backup.sh "$0" 2>/dev/null
chmod +x "$0"

# Установка зависимостей (если package.json изменился)
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Сборка проекта
echo "🔨 Сборка фронтенда..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не создана!"
    exit 1
fi

# Перезапуск сервера
echo "🔄 Перезапуск сервера..."
pm2 restart bio-server 2>/dev/null || pm2 start server/index.js --name "bio-server"
pm2 save

echo "✅ Обновление завершено!"
echo "🌐 Сайт: http://$(hostname -I | awk '{print $1}'):3000"
