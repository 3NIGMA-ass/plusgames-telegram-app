@echo off
chcp 65001 >nul
echo 🚀 Запуск PlusGames в режиме разработки с Docker
echo.

REM Проверяем Docker
echo 🐳 Проверяем Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker не найден! Установите Docker Desktop.
    echo 📥 Скачайте с: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo ✅ Docker найден

REM Проверяем Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose не найден!
    pause
    exit /b 1
)
echo ✅ Docker Compose найден

REM Проверяем .env файл
if not exist ".env" (
    echo 📝 Создаем .env файл из примера...
    copy "env.example" ".env"
    echo ⚠️ Не забудьте отредактировать .env файл с вашими настройками!
    echo.
    echo 📝 Откройте .env файл и заполните:
    echo    - TELEGRAM_BOT_TOKEN
    echo    - TELEGRAM_WEBAPP_URL
    echo    - NEXTAUTH_SECRET
    echo.
    pause
)

REM Останавливаем существующие контейнеры
echo 🛑 Останавливаем существующие контейнеры...
docker-compose down --remove-orphans

REM Запускаем только PostgreSQL для разработки
echo 🐘 Запускаем PostgreSQL в Docker...
docker-compose up -d postgres

REM Ждем запуска PostgreSQL
echo ⏳ Ждем запуска PostgreSQL (15 секунд)...
timeout /t 15 /nobreak >nul

REM Проверяем подключение к PostgreSQL
echo 🔍 Проверяем подключение к PostgreSQL...
docker-compose exec postgres pg_isready -U plusgames_user -d plusgames
if errorlevel 1 (
    echo ⚠️ PostgreSQL не готов, но продолжаем...
) else (
    echo ✅ PostgreSQL готов
)

REM Устанавливаем зависимости Node.js (если нужно)
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости Node.js...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ⚠️ Ошибка при установке зависимостей, но продолжаем...
    ) else (
        echo ✅ Зависимости установлены
    )
)

REM Запускаем приложение в режиме разработки
echo.
echo 🎯 Запускаем приложение в режиме разработки...
echo 🌐 Приложение будет доступно по адресу: http://localhost:3000
echo 📊 PostgreSQL доступен по адресу: localhost:5432
echo.
echo Для остановки нажмите Ctrl+C
echo Для остановки PostgreSQL: docker-compose down
echo.

npm run dev
