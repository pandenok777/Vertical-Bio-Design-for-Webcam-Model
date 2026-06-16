#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "🚀 Обновление: $PROJECT_DIR"
echo "⏰ $(date)"

# Сохраняем скрипт
cp "$0" /tmp/update_backup.sh 2>/dev/null

# Удаляем конфликтные файлы
rm -f deploy.sh update.sh 2>/dev/null

# Сброс изменений
git reset --hard
git clean -fd

# Pull
echo "📥 Git pull..."
if ! git pull origin main; then
    echo "❌ Ошибка git pull"
    mv /tmp/update_backup.sh "$0" 2>/dev/null
    exit 1
fi

# ★★★ ВСЕГДА устанавливаем зависимости ★★★
echo "📦 Установка зависимостей..."
npm install

# Проверяем что vite установлен
if ! npx vite --version >/dev/null 2>&1; then
    echo "❌ Ошибка: vite не установлен!"
    exit 1
fi

# Сборка
echo "🔨 Сборка..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: dist не создана!"
    exit 1
fi

# Перезапуск
echo "🔄 Перезапуск сервера..."
pm2 restart bio-server 2>/dev/null || pm2 start server/index.js --name "bio-server"
pm2 save

echo "✅ Готово! http://$(hostname -I | awk '{print $1}'):3000"
