# Скрипт для запуска PlusGames в режиме разработки на Windows
Write-Host "🚀 Запуск PlusGames в режиме разработки" -ForegroundColor Green

# Проверяем наличие .env файла
if (-not (Test-Path ".env")) {
    Write-Host "📝 Создаем .env файл из примера..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️ Не забудьте отредактировать .env файл с вашими настройками!" -ForegroundColor Yellow
    Write-Host "📝 Откройте .env файл и заполните:" -ForegroundColor Yellow
    Write-Host "   - TELEGRAM_BOT_TOKEN" -ForegroundColor White
    Write-Host "   - TELEGRAM_WEBAPP_URL" -ForegroundColor White
    Write-Host "   - DATABASE_URL" -ForegroundColor White
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

# Проверяем Node.js
Write-Host "🔍 Проверяем Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js не найден! Установите Node.js." -ForegroundColor Red
    Write-Host "📥 Скачайте с: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Проверяем npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm найден: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm не найден!" -ForegroundColor Red
    exit 1
}

# Устанавливаем зависимости если нужно
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
    try {
        npm install --legacy-peer-deps
        Write-Host "✅ Зависимости установлены" -ForegroundColor Green
    }
catch {
        Write-Host "❌ Ошибка при установке зависимостей" -ForegroundColor Red
        Write-Host "📋 Ошибка: $($_.Exception.Message)" -ForegroundColor Yellow
        exit 1
    }
}

# Проверяем PostgreSQL
Write-Host "🐘 Проверяем PostgreSQL..." -ForegroundColor Yellow
$dbUrl = [Environment]::GetEnvironmentVariable("DATABASE_URL", "Process")
if ($dbUrl) {
    Write-Host "✅ DATABASE_URL настроен" -ForegroundColor Green
    Write-Host "   URL: $dbUrl" -ForegroundColor Cyan
}
else {
    Write-Host "⚠️ DATABASE_URL не настроен в .env файле" -ForegroundColor Yellow
    Write-Host "📝 Для локальной разработки можно использовать SQLite или Docker PostgreSQL" -ForegroundColor Yellow
}

# Запускаем PostgreSQL в Docker (если нужно)
Write-Host "🐳 Запускаем PostgreSQL в Docker..." -ForegroundColor Yellow
try {
    # Проверяем, запущен ли уже PostgreSQL
    $postgresRunning = docker ps --filter "name=plusgames_db" --format "{{.Names}}"
    if ($postgresRunning -eq "plusgames_db") {
        Write-Host "✅ PostgreSQL уже запущен" -ForegroundColor Green
    }
    else {
        # Запускаем только PostgreSQL
        docker-compose up -d postgres
        Write-Host "✅ PostgreSQL запущен" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️ Не удалось запустить PostgreSQL в Docker" -ForegroundColor Yellow
    Write-Host "📝 Убедитесь, что Docker Desktop запущен" -ForegroundColor Yellow
}

# Ждем запуска базы данных
Write-Host "⏳ Ждем запуска базы данных (10 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверяем подключение к базе данных
Write-Host "🔍 Проверяем подключение к базе данных..." -ForegroundColor Yellow
try {
    $dbCheck = docker-compose exec postgres pg_isready -U plusgames_user -d plusgames
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ База данных готова" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ База данных не готова, но продолжаем..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠️ Не удалось проверить базу данных, но продолжаем..." -ForegroundColor Yellow
}

# Запускаем приложение в режиме разработки
Write-Host ""
Write-Host "🎯 Запускаем приложение в режиме разработки..." -ForegroundColor Green
Write-Host "🌐 Приложение будет доступно по адресу: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 База данных доступна по адресу: localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
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
    Write-Host "   2. Убедитесь, что все зависимости установлены" -ForegroundColor White
    Write-Host "   3. Проверьте .env файл" -ForegroundColor White
    Write-Host "   4. Запустите: npm install --legacy-peer-deps" -ForegroundColor White
}
