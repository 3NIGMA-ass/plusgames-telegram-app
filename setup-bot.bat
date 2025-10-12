@echo off
chcp 65001 >nul
echo 🤖 Настройка Telegram Bot для PlusGames Mini App
echo.

REM Проверяем наличие .env файла
if not exist ".env" (
    echo ❌ Файл .env не найден!
    echo 📝 Создайте .env файл из env.example и заполните переменные
    pause
    exit /b 1
)

echo ✅ Файл .env найден
echo 🔗 Настраиваем Telegram Bot...
echo.

REM Запускаем PowerShell скрипт для настройки бота
powershell -ExecutionPolicy Bypass -File "setup-bot.ps1"

echo.
echo 🎉 Настройка завершена!
echo.
echo 📝 Следующие шаги:
echo   1. Протестируйте бота в Telegram
echo   2. Отправьте команду /start боту
echo   3. Проверьте работу Web App
echo.
pause
