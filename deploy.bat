@echo off
chcp 65001 >nul
echo 🚀 Запуск развертывания PlusGames для Windows
echo.

REM Проверяем наличие .env файла
if not exist ".env" (
    echo ❌ Файл .env не найден!
    echo 📝 Создаем .env файл из примера...
    copy "env.example" ".env"
    echo ✅ Файл .env создан. Отредактируйте его и запустите скрипт снова.
    echo.
    echo 📝 Не забудьте заполнить:
    echo    - TELEGRAM_BOT_TOKEN (получить от @BotFather)
    echo    - TELEGRAM_WEBAPP_URL (ваш домен)
    echo    - DB_PASSWORD (надежный пароль)
    echo    - NEXTAUTH_SECRET (случайная строка)
    pause
    exit /b 1
)

echo ✅ Файл .env найден

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

REM Останавливаем существующие контейнеры
echo 🛑 Останавливаем существующие контейнеры...
docker-compose down --remove-orphans

REM Собираем и запускаем
echo 🔨 Собираем и запускаем контейнеры...
docker-compose up --build -d

REM Ждем запуска
echo ⏳ Ждем запуска сервисов (30 секунд)...
timeout /t 30 /nobreak >nul

REM Проверяем статус
echo 🔍 Проверяем статус сервисов...
docker-compose ps

echo.
echo 🎉 Развертывание завершено!
echo 🌐 Приложение доступно по адресу: http://localhost
echo.
echo 📋 Полезные команды:
echo   Просмотр логов: docker-compose logs -f
echo   Остановка: docker-compose down
echo   Перезапуск: docker-compose restart
echo.
echo 🤖 Следующий шаг - настройка Telegram Bot:
echo   setup-bot.bat
echo.
pause
