#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "🚀 Обновление: $PROJECT_DIR"

# Сохраняем скрипт
cp "$0" /tmp/update_backup.sh 2>/dev/null

# Удаляем конфликтные файлы
rm -f deploy.sh update.sh 2>/dev/null

# Сброс изменений
git reset --hard
git clean -fd

# Pull
echo "📥 Git pull..."
git pull origin main

# Восстанавливаем скрипт
mv /tmp/update_backup.sh "$0" 2>/dev/null
chmod +x "$0"

# ★★★ УСТАНОВКА ЗАВИСИМОСТЕЙ ★★★
echo "📦 npm install..."
npm install

# Сборка
echo "🔨 Сборка..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: dist не создана!"
    exit 1
fi

# Перезапуск
echo "🔄 Перезапуск..."
pm2 restart bio-server 2>/dev/null || pm2 start server/index.js --name "bio-server"
pm2 save

echo "✅ Готово!"
