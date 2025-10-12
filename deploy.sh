#!/bin/bash

# Скрипт для развертывания PlusGames Telegram Mini App
# Использование: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="plusgames"
DOMAIN=${TELEGRAM_WEBAPP_URL:-"https://yourdomain.com"}

echo "🚀 Начинаем развертывание PlusGames в режиме: $ENVIRONMENT"

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Скопируйте env.example в .env и заполните необходимые переменные:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Загружаем переменные окружения
export $(cat .env | grep -v '^#' | xargs)

# Проверяем обязательные переменные
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не установлен в .env файле"
    exit 1
fi

if [ -z "$TELEGRAM_WEBAPP_URL" ]; then
    echo "❌ TELEGRAM_WEBAPP_URL не установлен в .env файле"
    exit 1
fi

echo "✅ Переменные окружения загружены"

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down --remove-orphans || true

# Удаляем старые образы (опционально)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🧹 Очищаем старые образы..."
    docker system prune -f
fi

# Собираем и запускаем контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose up --build -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус сервисов
echo "🔍 Проверяем статус сервисов..."
docker-compose ps

# Проверяем здоровье приложения
echo "🏥 Проверяем здоровье приложения..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Приложение успешно запущено и отвечает на запросы"
else
    echo "❌ Приложение не отвечает на запросы"
    echo "📋 Логи приложения:"
    docker-compose logs app --tail=50
    exit 1
fi

# Показываем информацию о развертывании
echo ""
echo "🎉 Развертывание завершено успешно!"
echo "🌐 URL приложения: $DOMAIN"
echo "📊 Статус сервисов:"
docker-compose ps

echo ""
echo "📋 Полезные команды:"
echo "  Просмотр логов: docker-compose logs -f"
echo "  Остановка: docker-compose down"
echo "  Перезапуск: docker-compose restart"
echo "  Обновление: ./deploy.sh $ENVIRONMENT"

echo ""
echo "🤖 Не забудьте настроить Telegram Bot:"
echo "  1. Создайте бота через @BotFather"
echo "  2. Установите Web App URL: $DOMAIN"
echo "  3. Добавьте бота в группу или канал"
