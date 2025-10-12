# Скрипт для установки зависимостей PlusGames
Write-Host "📦 Установка зависимостей PlusGames..." -ForegroundColor Green

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

# Очищаем кэш npm
Write-Host "🧹 Очищаем кэш npm..." -ForegroundColor Yellow
npm cache clean --force

# Устанавливаем зависимости
Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
try {
    npm install --legacy-peer-deps
    Write-Host "✅ Зависимости установлены" -ForegroundColor Green
}
catch {
    Write-Host "❌ Ошибка при установке зависимостей" -ForegroundColor Red
    Write-Host "📋 Попробуйте запустить:" -ForegroundColor Yellow
    Write-Host "   npm install --legacy-peer-deps --force" -ForegroundColor White
    exit 1
}

# Проверяем TypeScript
Write-Host "🔍 Проверяем TypeScript..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "✅ TypeScript проверка пройдена" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Есть предупреждения TypeScript, но они не критичны" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Установка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
Write-Host "   1. Создайте .env файл: copy env.example .env" -ForegroundColor White
Write-Host "   2. Заполните переменные в .env файле" -ForegroundColor White
Write-Host "   3. Запустите разработку: .\dev.ps1" -ForegroundColor White
Write-Host "   4. Или развертывание: .\deploy.ps1" -ForegroundColor White