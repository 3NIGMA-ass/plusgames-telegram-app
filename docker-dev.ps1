# Скрипт для запуска PlusGames в режиме разработки с Docker
Write-Host "🚀 Запуск PlusGames в режиме разработки с Docker" -ForegroundColor Green

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
    Write-Host "   - TELEGRAM_BOT_TOKEN" -ForegroundColor White
    Write-Host "   - TELEGRAM_WEBAPP_URL" -ForegroundColor White
    Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor White
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

# Останавливаем существующие контейнеры
Write-Host "🛑 Останавливаем существующие контейнеры..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Запускаем только PostgreSQL для разработки
Write-Host "🐘 Запускаем PostgreSQL в Docker..." -ForegroundColor Yellow
docker-compose up -d postgres

# Ждем запуска PostgreSQL
Write-Host "⏳ Ждем запуска PostgreSQL (15 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Проверяем подключение к PostgreSQL
Write-Host "🔍 Проверяем подключение к PostgreSQL..." -ForegroundColor Yellow
try {
    $dbCheck = docker-compose exec postgres pg_isready -U plusgames_user -d plusgames
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL готов" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ PostgreSQL не готов, но продолжаем..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ Не удалось проверить PostgreSQL, но продолжаем..." -ForegroundColor Yellow
}

# Устанавливаем зависимости Node.js (если нужно)
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Устанавливаем зависимости Node.js..." -ForegroundColor Yellow
    try {
        npm install --legacy-peer-deps
        Write-Host "✅ Зависимости установлены" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Ошибка при установке зависимостей, но продолжаем..." -ForegroundColor Yellow
    }
}

# Запускаем приложение в режиме разработки
Write-Host ""
Write-Host "🎯 Запускаем приложение в режиме разработки..." -ForegroundColor Green
Write-Host "🌐 Приложение будет доступно по адресу: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 PostgreSQL доступен по адресу: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "Для остановки PostgreSQL: docker-compose down" -ForegroundColor Yellow
Write-Host ""

try {
    npm run dev
}
catch {
    Write-Host "❌ Ошибка при запуске приложения" -ForegroundColor Red
    Write-Host "📋 Ошибка: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Возможные решения:" -ForegroundColor Yellow
    Write-Host "   1. Проверьте, что порт 3000 свободен" -ForegroundColor White
    Write-Host "   2. Убедитесь, что PostgreSQL запущен: docker-compose ps" -ForegroundColor White
    Write-Host "   3. Проверьте .env файл" -ForegroundColor White
    Write-Host "   4. Запустите: npm install --legacy-peer-deps" -ForegroundColor White
}
