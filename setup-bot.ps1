# Скрипт настройки Telegram Bot для Windows
Write-Host "🤖 Настройка Telegram Bot для PlusGames Mini App" -ForegroundColor Green

# Загружаем переменные окружения
if (Test-Path ".env") {
    Write-Host "📋 Загружаем переменные окружения..." -ForegroundColor Yellow
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "✅ Переменные окружения загружены" -ForegroundColor Green
}
else {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "📝 Создайте .env файл из env.example и заполните переменные" -ForegroundColor Yellow
    exit 1
}

$botToken = [Environment]::GetEnvironmentVariable("TELEGRAM_BOT_TOKEN", "Process")
$webappUrl = [Environment]::GetEnvironmentVariable("TELEGRAM_WEBAPP_URL", "Process")

if (-not $botToken) {
    Write-Host "❌ TELEGRAM_BOT_TOKEN не установлен в .env файле" -ForegroundColor Red
    Write-Host "📝 Получите токен от @BotFather в Telegram" -ForegroundColor Yellow
    exit 1
}

if (-not $webappUrl) {
    Write-Host "❌ TELEGRAM_WEBAPP_URL не установлен в .env файле" -ForegroundColor Red
    Write-Host "📝 Установите URL вашего приложения в .env файл" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔗 URL приложения: $webappUrl" -ForegroundColor Cyan

# Функция для отправки запросов к Telegram API
function Send-TelegramRequest {
    param(
        [string]$Method,
        [string]$Data
    )
    
    $url = "https://api.telegram.org/bot$botToken/$Method"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $Data -ContentType "application/json" -ErrorAction Stop
        return $response
    }
    catch {
        Write-Host "❌ Ошибка при отправке запроса к $Method`: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "📋 Ответ сервера: $responseBody" -ForegroundColor Yellow
        }
        return $null
    }
}

# Получаем информацию о боте
Write-Host "📋 Получаем информацию о боте..." -ForegroundColor Yellow
$botInfo = Send-TelegramRequest -Method "getMe" -Data "{}"
if ($botInfo -and $botInfo.ok) {
    Write-Host "✅ Информация о боте получена" -ForegroundColor Green
    Write-Host "   Username: @$($botInfo.result.username)" -ForegroundColor Cyan
    Write-Host "   Имя: $($botInfo.result.first_name)" -ForegroundColor Cyan
    Write-Host "   ID: $($botInfo.result.id)" -ForegroundColor Cyan
}
else {
    Write-Host "❌ Не удалось получить информацию о боте. Проверьте токен." -ForegroundColor Red
    exit 1
}

# Устанавливаем Web App URL
Write-Host "🔗 Устанавливаем Web App URL..." -ForegroundColor Yellow
$webappData = @{
    url = $webappUrl
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setWebhook" -Data $webappData
if ($result -and $result.ok) {
    Write-Host "✅ Web App URL установлен" -ForegroundColor Green
}
else {
    Write-Host "❌ Не удалось установить Web App URL" -ForegroundColor Red
    exit 1
}

# Устанавливаем команды бота
Write-Host "⌨️ Устанавливаем команды бота..." -ForegroundColor Yellow
$commandsData = @{
    commands = @(
        @{ command = "start"; description = "Запустить PlusGames" },
        @{ command = "help"; description = "Помощь по использованию" },
        @{ command = "balance"; description = "Показать баланс" },
        @{ command = "profile"; description = "Мой профиль" },
        @{ command = "wallet"; description = "Мой кошелек" },
        @{ command = "invest"; description = "Инвестировать" }
    )
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setMyCommands" -Data $commandsData
if ($result -and $result.ok) {
    Write-Host "✅ Команды бота установлены" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Не удалось установить команды бота" -ForegroundColor Yellow
}

# Устанавливаем описание бота
Write-Host "📝 Устанавливаем описание бота..." -ForegroundColor Yellow
$descriptionData = @{
    description = "PlusGames - инвестиционная платформа с высокими доходами. Начните зарабатывать уже сегодня!"
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setMyDescription" -Data $descriptionData
if ($result -and $result.ok) {
    Write-Host "✅ Описание бота установлено" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Не удалось установить описание бота" -ForegroundColor Yellow
}

# Устанавливаем короткое описание бота
Write-Host "📝 Устанавливаем короткое описание бота..." -ForegroundColor Yellow
$shortDescriptionData = @{
    short_description = "Инвестиционная платформа PlusGames"
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setMyShortDescription" -Data $shortDescriptionData
if ($result -and $result.ok) {
    Write-Host "✅ Короткое описание бота установлено" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Не удалось установить короткое описание бота" -ForegroundColor Yellow
}

# Устанавливаем меню бота
Write-Host "🍔 Устанавливаем меню бота..." -ForegroundColor Yellow
$menuData = @{
    commands = @(
        @{ command = "start"; description = "🚀 Запустить PlusGames" },
        @{ command = "wallet"; description = "💰 Мой кошелек" },
        @{ command = "invest"; description = "📈 Инвестировать" },
        @{ command = "profile"; description = "👤 Мой профиль" },
        @{ command = "help"; description = "❓ Помощь" }
    )
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setMyCommands" -Data $menuData
if ($result -and $result.ok) {
    Write-Host "✅ Меню бота установлено" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Настройка Telegram Bot завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Информация о боте:" -ForegroundColor Yellow
Write-Host "   Username: @$($botInfo.result.username)" -ForegroundColor Cyan
Write-Host "   Имя: $($botInfo.result.first_name)" -ForegroundColor Cyan
Write-Host "   ID: $($botInfo.result.id)" -ForegroundColor Cyan
Write-Host "   Может присоединяться к группам: $($botInfo.result.can_join_groups)" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔗 Ссылки для тестирования:" -ForegroundColor Yellow
Write-Host "   Telegram: https://t.me/$($botInfo.result.username)" -ForegroundColor Cyan
Write-Host "   Web App: $webappUrl" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 Следующие шаги:" -ForegroundColor Yellow
Write-Host "   1. Протестируйте бота в Telegram" -ForegroundColor White
Write-Host "   2. Отправьте команду /start боту" -ForegroundColor White
Write-Host "   3. Проверьте работу Web App" -ForegroundColor White
Write-Host "   4. Добавьте бота в группу или канал (если нужно)" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Полезные команды для тестирования:" -ForegroundColor Yellow
Write-Host "   /start - Запустить приложение" -ForegroundColor White
Write-Host "   /help - Получить помощь" -ForegroundColor White
Write-Host "   /balance - Показать баланс" -ForegroundColor White
Write-Host "   /profile - Мой профиль" -ForegroundColor White
