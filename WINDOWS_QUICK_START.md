# 🪟 Быстрый старт PlusGames на Windows

## 🎯 Простой способ развертывания

### Вариант 1: Docker Desktop (Рекомендуется)

#### 1. Установите Docker Desktop
- Скачайте с [docker.com](https://www.docker.com/products/docker-desktop/)
- Установите и запустите Docker Desktop

#### 2. Настройте проект
```powershell
# Откройте PowerShell в папке проекта
cd C:\Users\ivan1\Desktop\project

# Создайте .env файл
copy env.example .env
notepad .env
```

#### 3. Заполните .env файл
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_WEBAPP_URL=https://yourdomain.com
DB_PASSWORD=надежный_пароль
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=случайная_строка
```

#### 4. Запустите развертывание
```powershell
# Запуск развертывания
.\deploy.ps1

# Настройка Telegram Bot
.\setup-bot.ps1
```

### Вариант 2: Локальная разработка

#### 1. Установите Node.js
- Скачайте с [nodejs.org](https://nodejs.org/)
- Установите LTS версию

#### 2. Установите PostgreSQL
- Скачайте с [postgresql.org](https://www.postgresql.org/download/windows/)
- Установите с настройками по умолчанию

#### 3. Запустите разработку
```powershell
# Установка зависимостей
npm install --legacy-peer-deps

# Запуск в режиме разработки
.\dev.ps1
```

## 🤖 Создание Telegram Bot

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/newbot`
4. Введите имя: "PlusGames Bot"
5. Введите username: "plusgames_bot"
6. Скопируйте токен в .env файл

## 🌐 Настройка домена

### Для локального тестирования
```env
TELEGRAM_WEBAPP_URL=https://ngrok.io/your-tunnel-url
```

### Для продакшена
1. Получите домен (Cloudflare, Namecheap, etc.)
2. Настройте A-запись на IP сервера
3. Обновите TELEGRAM_WEBAPP_URL в .env

## 🚀 Команды

```powershell
# Развертывание
.\deploy.ps1

# Настройка бота
.\setup-bot.ps1

# Разработка
.\dev.ps1

# Docker команды
docker-compose up -d          # Запуск
docker-compose down           # Остановка
docker-compose logs -f        # Логи
docker-compose restart        # Перезапуск
```

## 🔧 Устранение неполадок

### Docker не запускается
- Убедитесь, что Docker Desktop запущен
- Проверьте, что WSL2 включен
- Перезагрузите компьютер

### Приложение не отвечает
```powershell
# Проверьте логи
docker-compose logs app

# Проверьте статус
docker-compose ps

# Перезапустите
docker-compose restart
```

### База данных не подключается
```powershell
# Проверьте PostgreSQL
docker-compose logs postgres

# Проверьте подключение
docker-compose exec postgres psql -U plusgames_user -d plusgames
```

## 📱 Тестирование

1. Откройте браузер: http://localhost:3000
2. Найдите вашего бота в Telegram
3. Отправьте `/start`
4. Проверьте работу Web App

## 🎉 Готово!

Ваш Telegram Mini App готов к работе! 🚀

**Полезные ссылки:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/windows/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
