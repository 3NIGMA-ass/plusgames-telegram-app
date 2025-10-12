# 🪟 Развертывание PlusGames на Windows

## 🎯 Варианты развертывания для Windows

### Вариант 1: Docker Desktop (Рекомендуется)

#### 1. Установка Docker Desktop

1. Скачайте Docker Desktop с [официального сайта](https://www.docker.com/products/docker-desktop/)
2. Установите Docker Desktop
3. Запустите Docker Desktop
4. Убедитесь, что Docker работает: откройте PowerShell и выполните `docker --version`

#### 2. Установка WSL2 (если нужно)

```powershell
# В PowerShell от имени администратора
wsl --install
# Перезагрузите компьютер после установки
```

#### 3. Развертывание проекта

```powershell
# Перейдите в папку проекта
cd C:\Users\ivan1\Desktop\project

# Скопируйте файл конфигурации
copy env.example .env

# Отредактируйте .env файл (заполните ваши данные)
notepad .env
```

**Заполните .env файл:**
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_WEBAPP_URL=https://yourdomain.com
DB_PASSWORD=надежный_пароль
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=случайная_строка
```

#### 4. Запуск через Docker Compose

```powershell
# Запуск в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Вариант 2: Локальная разработка на Windows

#### 1. Установка Node.js

1. Скачайте Node.js с [nodejs.org](https://nodejs.org/)
2. Установите LTS версию
3. Проверьте установку: `node --version` и `npm --version`

#### 2. Установка PostgreSQL

1. Скачайте PostgreSQL с [postgresql.org](https://www.postgresql.org/download/windows/)
2. Установите с настройками по умолчанию
3. Запомните пароль для пользователя postgres
4. Создайте базу данных:

```sql
-- Подключитесь к PostgreSQL через pgAdmin или psql
CREATE DATABASE plusgames;
CREATE USER plusgames_user WITH PASSWORD 'ваш_пароль';
GRANT ALL PRIVILEGES ON DATABASE plusgames TO plusgames_user;
```

#### 3. Восстановление базы данных

```powershell
# Восстановите дамп базы данных
psql -U postgres -d plusgames -f plusgames.dump
```

#### 4. Запуск приложения

```powershell
# Установка зависимостей
npm install --legacy-peer-deps

# Запуск в режиме разработки
npm run dev
```

### Вариант 3: Развертывание на VPS через Windows

#### 1. Подключение к VPS

Используйте один из способов:
- **PuTTY** - для SSH подключения
- **Windows Terminal** с WSL
- **VS Code** с расширением Remote-SSH

#### 2. Загрузка файлов на сервер

```powershell
# Используйте SCP или WinSCP
scp -r C:\Users\ivan1\Desktop\project user@your-server-ip:/home/user/

# Или используйте Git
git clone your-repo-url
```

#### 3. Развертывание на сервере

```bash
# На сервере (Linux)
cd /home/user/project
chmod +x deploy.sh setup-telegram-bot.sh
./deploy.sh production
```

## 🔧 Создание Telegram Bot на Windows

### 1. Создание бота

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/newbot`
4. Введите имя бота
5. Введите username бота
6. Скопируйте токен

### 2. Настройка Web App

```powershell
# Создайте PowerShell скрипт для настройки бота
# Создайте файл setup-bot.ps1
```

## 📁 Структура файлов для Windows

```
project/
├── app/                    # Исходный код Next.js
├── public/                 # Статические файлы
├── .env                    # Переменные окружения (создать)
├── docker-compose.yml      # Docker конфигурация
├── Dockerfile             # Docker образ
├── nginx.conf             # Nginx конфигурация
├── plusgames.dump         # Дамп базы данных
├── deploy.ps1             # PowerShell скрипт деплоя
├── setup-bot.ps1          # PowerShell скрипт настройки бота
└── README_WINDOWS.md      # Эта инструкция
```

## 🚀 PowerShell скрипты для Windows

### deploy.ps1

```powershell
# Скрипт развертывания для Windows
param(
    [string]$Environment = "production"
)

Write-Host "🚀 Запуск развертывания PlusGames в режиме: $Environment" -ForegroundColor Green

# Проверяем наличие .env файла
if (-not (Test-Path ".env")) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "📝 Скопируйте env.example в .env и заполните переменные" -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Файл .env создан. Отредактируйте его и запустите скрипт снова." -ForegroundColor Green
    exit 1
}

# Останавливаем существующие контейнеры
Write-Host "🛑 Останавливаем существующие контейнеры..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Собираем и запускаем
Write-Host "🔨 Собираем и запускаем контейнеры..." -ForegroundColor Yellow
docker-compose up --build -d

# Ждем запуска
Write-Host "⏳ Ждем запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Проверяем статус
Write-Host "🔍 Проверяем статус сервисов..." -ForegroundColor Yellow
docker-compose ps

Write-Host "🎉 Развертывание завершено!" -ForegroundColor Green
Write-Host "🌐 Приложение доступно по адресу: http://localhost" -ForegroundColor Cyan
```

### setup-bot.ps1

```powershell
# Скрипт настройки Telegram Bot для Windows
Write-Host "🤖 Настройка Telegram Bot для PlusGames" -ForegroundColor Green

# Загружаем переменные окружения
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$botToken = $env:TELEGRAM_BOT_TOKEN
$webappUrl = $env:TELEGRAM_WEBAPP_URL

if (-not $botToken) {
    Write-Host "❌ TELEGRAM_BOT_TOKEN не установлен в .env файле" -ForegroundColor Red
    exit 1
}

if (-not $webappUrl) {
    Write-Host "❌ TELEGRAM_WEBAPP_URL не установлен в .env файле" -ForegroundColor Red
    exit 1
}

Write-Host "🔗 URL приложения: $webappUrl" -ForegroundColor Cyan

# Функция для отправки запросов к Telegram API
function Send-TelegramRequest {
    param(
        [string]$Method,
        [string]$Data
    )
    
    $url = "https://api.telegram.org/bot$botToken/$Method"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $Data -ContentType "application/json"
        return $response
    }
    catch {
        Write-Host "❌ Ошибка при отправке запроса: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Получаем информацию о боте
Write-Host "📋 Получаем информацию о боте..." -ForegroundColor Yellow
$botInfo = Send-TelegramRequest -Method "getMe" -Data "{}"
if ($botInfo) {
    Write-Host "✅ Информация о боте получена" -ForegroundColor Green
    Write-Host "   Username: $($botInfo.result.username)" -ForegroundColor Cyan
}

# Устанавливаем Web App URL
Write-Host "🔗 Устанавливаем Web App URL..." -ForegroundColor Yellow
$webappData = @{
    url = $webappUrl
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setWebhook" -Data $webappData
if ($result) {
    Write-Host "✅ Web App URL установлен" -ForegroundColor Green
}

# Устанавливаем команды бота
Write-Host "⌨️ Устанавливаем команды бота..." -ForegroundColor Yellow
$commandsData = @{
    commands = @(
        @{ command = "start"; description = "Запустить PlusGames" },
        @{ command = "help"; description = "Помощь по использованию" },
        @{ command = "balance"; description = "Показать баланс" },
        @{ command = "profile"; description = "Мой профиль" }
    )
} | ConvertTo-Json

$result = Send-TelegramRequest -Method "setMyCommands" -Data $commandsData
if ($result) {
    Write-Host "✅ Команды бота установлены" -ForegroundColor Green
}

Write-Host "🎉 Настройка Telegram Bot завершена!" -ForegroundColor Green
Write-Host "🔗 Ссылка на бота: https://t.me/$($botInfo.result.username)" -ForegroundColor Cyan
```

## 🎯 Быстрый старт для Windows

### 1. Подготовка

```powershell
# Откройте PowerShell в папке проекта
cd C:\Users\ivan1\Desktop\project

# Создайте .env файл
copy env.example .env
notepad .env
```

### 2. Заполните .env файл

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBAPP_URL=https://yourdomain.com
DB_PASSWORD=your_secure_password
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key
```

### 3. Запуск через Docker

```powershell
# Запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### 4. Настройка бота

```powershell
# Запустите скрипт настройки бота
.\setup-bot.ps1
```

## 🔧 Альтернативы для Windows

### 1. Использование WSL2

```powershell
# Установите WSL2
wsl --install

# В WSL2 выполните Linux команды
wsl
cd /mnt/c/Users/ivan1/Desktop/project
chmod +x deploy.sh
./deploy.sh production
```

### 2. Использование GitHub Actions

Создайте `.github/workflows/deploy.yml` для автоматического развертывания на VPS.

### 3. Использование облачных сервисов

- **Vercel** - для фронтенда
- **Railway** - для полного стека
- **Heroku** - для быстрого развертывания

## 📞 Поддержка

Если возникли проблемы:

1. Убедитесь, что Docker Desktop запущен
2. Проверьте, что все порты свободны (3000, 5432, 80)
3. Проверьте логи: `docker-compose logs`
4. Убедитесь, что .env файл заполнен правильно

## 🎉 Готово!

Теперь у вас есть все необходимое для развертывания PlusGames на Windows! 🚀
