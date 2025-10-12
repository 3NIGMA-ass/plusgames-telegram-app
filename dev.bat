@echo off
chcp 65001 >nul
echo 🚀 Запуск PlusGames в режиме разработки
echo.

REM Проверяем наличие .env файла
if not exist ".env" (
    echo 📝 Создаем .env файл из примера...
    copy "env.example" ".env"
    echo ⚠️ Не забудьте отредактировать .env файл с вашими настройками!
    echo.
    echo 📝 Откройте .env файл и заполните:
    echo    - TELEGRAM_BOT_TOKEN
    echo    - TELEGRAM_WEBAPP_URL
    echo    - DATABASE_URL
    echo    - NEXTAUTH_SECRET
    echo.
    pause
)

REM Проверяем Node.js
echo 🔍 Проверяем Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите Node.js.
    echo 📥 Скачайте с: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js найден

REM Проверяем npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не найден!
    pause
    exit /b 1
)
echo ✅ npm найден

REM Устанавливаем зависимости если нужно
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Ошибка при установке зависимостей
        pause
        exit /b 1
    )
    echo ✅ Зависимости установлены
)

REM Запускаем PostgreSQL в Docker
echo 🐳 Запускаем PostgreSQL в Docker...
docker-compose up -d postgres

REM Ждем запуска базы данных
echo ⏳ Ждем запуска базы данных (10 секунд)...
timeout /t 10 /nobreak >nul

REM Запускаем приложение
echo.
echo 🎯 Запускаем приложение в режиме разработки...
echo 🌐 Приложение будет доступно по адресу: http://localhost:3000
echo 📊 База данных доступна по адресу: localhost:5432
echo.
echo Для остановки нажмите Ctrl+C
echo.

npm run dev
