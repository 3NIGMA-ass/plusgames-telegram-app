# Скрипт для полного развертывания PlusGames с Docker
Write-Host "🚀 Полное развертывание PlusGames с Docker" -ForegroundColor Green

# Проверяем Docker
Write-Host "🐳 Проверяем Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker найден: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker не найден! Установите Docker Desktop." -ForegroundColor Red
    Write-Host "📥 Скачайте с: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Проверяем Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose найден: $composeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker Compose не найден!" -ForegroundColor Red
    exit 1
}

# Проверяем .env файл
if (-not (Test-Path ".env")) {
    Write-Host "📝 Создаем .env файл из примера..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️ Не забудьте отредактировать .env файл с вашими настройками!" -ForegroundColor Yellow
    Write-Host "📝 Откройте .env файл и заполните:" -ForegroundColor Yellow
    Write-Host "   - TELEGRAM_BOT_TOKEN (получить от @BotFather)" -ForegroundColor White
    Write-Host "   - TELEGRAM_WEBAPP_URL (ваш домен)" -ForegroundColor White
    Write-Host "   - DB_PASSWORD (надежный пароль)" -ForegroundColor White
    Write-Host "   - NEXTAUTH_SECRET (случайная строка)" -ForegroundColor White
    Write-Host ""
    Write-Host "Нажмите любую клавишу после редактирования .env файла..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Загружаем переменные окружения
Write-Host "📋 Загружаем переменные окружения..." -ForegroundColor Yellow
Get-Content ".env" | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Проверяем обязательные переменные
$requiredVars = @("TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBAPP_URL", "DB_PASSWORD")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var, "Process")) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Отсутствуют обязательные переменные:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host "📝 Отредактируйте .env файл и запустите скрипт снова." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Переменные окружения загружены" -ForegroundColor Green

# Останавливаем существующие контейнеры
Write-Host "🛑 Останавливаем существующие контейнеры..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Удаляем старые образы (опционально)
Write-Host "🧹 Очищаем старые образы..." -ForegroundColor Yellow
try {
    docker system prune -f
    Write-Host "✅ Очистка завершена" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Предупреждение: Не удалось очистить образы" -ForegroundColor Yellow
}

# Собираем и запускаем все контейнеры
Write-Host "🔨 Собираем и запускаем все контейнеры..." -ForegroundColor Yellow
try {
    docker-compose up --build -d
    Write-Host "✅ Контейнеры запущены" -ForegroundColor Green
}
catch {
    Write-Host "❌ Ошибка при запуске контейнеров" -ForegroundColor Red
    Write-Host "📋 Логи:" -ForegroundColor Yellow
    docker-compose logs
    exit 1
}

# Ждем запуска сервисов
Write-Host "⏳ Ждем запуска сервисов (30 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Проверяем статус сервисов
Write-Host "🔍 Проверяем статус сервисов..." -ForegroundColor Yellow
docker-compose ps

# Проверяем здоровье приложения
Write-Host "🏥 Проверяем здоровье приложения..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Приложение успешно запущено и отвечает на запросы" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Приложение запущено, но health check не прошел" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Приложение не отвечает на запросы" -ForegroundColor Red
    Write-Host "📋 Логи приложения:" -ForegroundColor Yellow
    docker-compose logs app --tail=50
    Write-Host "🔧 Попробуйте перезапустить: docker-compose restart" -ForegroundColor Yellow
}

# Показываем информацию о развертывании
Write-Host ""
Write-Host "🎉 Развертывание завершено!" -ForegroundColor Green
Write-Host "🌐 URL приложения: $([Environment]::GetEnvironmentVariable('TELEGRAM_WEBAPP_URL', 'Process'))" -ForegroundColor Cyan
Write-Host "📊 Статус сервисов:" -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "📋 Полезные команды:" -ForegroundColor Yellow
Write-Host "  Просмотр логов: docker-compose logs -f" -ForegroundColor White
Write-Host "  Остановка: docker-compose down" -ForegroundColor White
Write-Host "  Перезапуск: docker-compose restart" -ForegroundColor White
Write-Host "  Обновление: .\docker-deploy.ps1" -ForegroundColor White

Write-Host ""
Write-Host "🤖 Следующий шаг - настройка Telegram Bot:" -ForegroundColor Yellow
Write-Host "  .\setup-bot.ps1" -ForegroundColor White
