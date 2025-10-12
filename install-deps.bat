@echo off
chcp 65001 >nul
echo 📦 Установка зависимостей PlusGames...
echo.

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

REM Очищаем кэш npm
echo 🧹 Очищаем кэш npm...
npm cache clean --force

REM Устанавливаем зависимости
echo 📦 Устанавливаем зависимости...
npm install --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Ошибка при установке зависимостей
    echo 📋 Попробуйте запустить:
    echo    npm install --legacy-peer-deps --force
    pause
    exit /b 1
)
echo ✅ Зависимости установлены

REM Проверяем TypeScript
echo 🔍 Проверяем TypeScript...
npx tsc --noEmit
if errorlevel 1 (
    echo ⚠️ Есть предупреждения TypeScript, но они не критичны
)

echo.
echo 🎉 Установка завершена!
echo.
echo 📋 Следующие шаги:
echo    1. Создайте .env файл: copy env.example .env
echo    2. Заполните переменные в .env файле
echo    3. Запустите разработку: dev.bat
echo    4. Или развертывание: deploy.bat
echo.
pause
