#!/bin/bash

# Скрипт для настройки Telegram Bot для PlusGames Mini App
# Использование: ./setup-telegram-bot.sh

set -e

# Загружаем переменные окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не установлен в .env файле"
    echo "📝 Создайте бота через @BotFather и добавьте токен в .env файл"
    exit 1
fi

if [ -z "$TELEGRAM_WEBAPP_URL" ]; then
    echo "❌ TELEGRAM_WEBAPP_URL не установлен в .env файле"
    echo "📝 Установите URL вашего приложения в .env файл"
    exit 1
fi

echo "🤖 Настраиваем Telegram Bot для PlusGames Mini App"
echo "🔗 URL приложения: $TELEGRAM_WEBAPP_URL"

# Функция для отправки запросов к Telegram Bot API
send_telegram_request() {
    local method=$1
    local data=$2
    local url="https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/$method"
    
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$data" \
        "$url"
}

# Получаем информацию о боте
echo "📋 Получаем информацию о боте..."
bot_info=$(send_telegram_request "getMe" "{}")
echo "✅ Информация о боте получена"

# Устанавливаем Web App URL
echo "🔗 Устанавливаем Web App URL..."
webapp_data=$(cat <<EOF
{
    "url": "$TELEGRAM_WEBAPP_URL"
}
EOF
)

result=$(send_telegram_request "setWebhook" "$webapp_data")
echo "✅ Web App URL установлен"

# Устанавливаем команды бота
echo "⌨️ Устанавливаем команды бота..."
commands_data=$(cat <<EOF
{
    "commands": [
        {
            "command": "start",
            "description": "Запустить PlusGames"
        },
        {
            "command": "help",
            "description": "Помощь по использованию"
        },
        {
            "command": "balance",
            "description": "Показать баланс"
        },
        {
            "command": "profile",
            "description": "Мой профиль"
        }
    ]
}
EOF
)

result=$(send_telegram_request "setMyCommands" "$commands_data")
echo "✅ Команды бота установлены"

# Устанавливаем описание бота
echo "📝 Устанавливаем описание бота..."
description_data=$(cat <<EOF
{
    "description": "PlusGames - инвестиционная платформа с высокими доходами. Начните зарабатывать уже сегодня!"
}
EOF
)

result=$(send_telegram_request "setMyDescription" "$description_data")
echo "✅ Описание бота установлено"

# Устанавливаем короткое описание бота
echo "📝 Устанавливаем короткое описание бота..."
short_description_data=$(cat <<EOF
{
    "short_description": "Инвестиционная платформа PlusGames"
}
EOF
)

result=$(send_telegram_request "setMyShortDescription" "$short_description_data")
echo "✅ Короткое описание бота установлено"

echo ""
echo "🎉 Настройка Telegram Bot завершена!"
echo ""
echo "📋 Информация о боте:"
echo "$bot_info" | jq '.result | {username: .username, first_name: .first_name, can_join_groups: .can_join_groups, can_read_all_group_messages: .can_read_all_group_messages}'

echo ""
echo "🔗 Ссылки для тестирования:"
echo "   Telegram: https://t.me/$(echo $bot_info | jq -r '.result.username')"
echo "   Web App: $TELEGRAM_WEBAPP_URL"

echo ""
echo "📝 Следующие шаги:"
echo "   1. Протестируйте бота в Telegram"
echo "   2. Добавьте бота в группу или канал (если нужно)"
echo "   3. Настройте меню бота через @BotFather"
echo "   4. Протестируйте Web App через бота"
