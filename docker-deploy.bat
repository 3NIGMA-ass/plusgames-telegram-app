@echo off
chcp 65001 >nul
echo 🚀 Полное развертывание PlusGames с Docker
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
    echo    - TELEGRAM_BOT_TOKEN (получить от @BotFather)
    echo    - TELEGRAM_WEBAPP_URL (ваш домен)
    echo    - DB_PASSWORD (надежный пароль)
    echo    - NEXTAUTH_SECRET (случайная строка)
    echo.
    pause
)

REM Останавливаем существующие контейнеры
echo 🛑 Останавливаем существующие контейнеры...
docker-compose down --remove-orphans

REM Удаляем старые образы
echo 🧹 Очищаем старые образы...
docker system prune -f

REM Собираем и запускаем все контейнеры
echo 🔨 Собираем и запускаем все контейнеры...
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Ошибка при запуске контейнеров
    echo 📋 Логи:
    docker-compose logs
    pause
    exit /b 1
)
echo ✅ Контейнеры запущены

REM Ждем запуска сервисов
echo ⏳ Ждем запуска сервисов (30 секунд)...
timeout /t 30 /nobreak >nul

REM Проверяем статус сервисов
echo 🔍 Проверяем статус сервисов...
docker-compose ps

REM Проверяем здоровье приложения
echo 🏥 Проверяем здоровье приложения...
curl -f http://localhost/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Приложение не отвечает на запросы
    echo 📋 Логи приложения:
    docker-compose logs app --tail=50
    echo 🔧 Попробуйте перезапустить: docker-compose restart
) else (
    echo ✅ Приложение успешно запущено и отвечает на запросы
)

echo.
echo 🎉 Развертывание завершено!
echo 🌐 URL приложения: http://localhost
echo.
echo 📋 Полезные команды:
echo   Просмотр логов: docker-compose logs -f
echo   Остановка: docker-compose down
echo   Перезапуск: docker-compose restart
echo   Обновление: docker-deploy.bat
echo.
echo 🤖 Следующий шаг - настройка Telegram Bot:
echo   setup-bot.bat
echo.
pause
