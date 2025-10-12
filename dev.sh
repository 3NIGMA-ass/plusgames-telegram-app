#!/bin/bash

# Скрипт для запуска PlusGames в режиме разработки
# Использование: ./dev.sh

set -e

echo "🚀 Запускаем PlusGames в режиме разработки"

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл из примера..."
    cp env.example .env
    echo "⚠️  Не забудьте отредактировать .env файл с вашими настройками!"
fi

# Загружаем переменные окружения
export $(cat .env | grep -v '^#' | xargs)

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install --legacy-peer-deps
fi

# Запускаем PostgreSQL в Docker
echo "🐘 Запускаем PostgreSQL..."
docker-compose up -d postgres

# Ждем запуска базы данных
echo "⏳ Ждем запуска базы данных..."
sleep 10

# Проверяем подключение к базе данных
echo "🔍 Проверяем подключение к базе данных..."
if docker-compose exec postgres pg_isready -U plusgames_user -d plusgames > /dev/null 2>&1; then
    echo "✅ База данных готова"
else
    echo "❌ Не удалось подключиться к базе данных"
    exit 1
fi

# Запускаем приложение в режиме разработки
echo "🎯 Запускаем приложение в режиме разработки..."
echo "🌐 Приложение будет доступно по адресу: http://localhost:3000"
echo "📊 База данных доступна по адресу: localhost:5432"
echo ""
echo "Для остановки нажмите Ctrl+C"

npm run dev
