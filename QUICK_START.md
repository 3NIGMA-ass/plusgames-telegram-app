# 🚀 Быстрый старт PlusGames Telegram Mini App

## 📋 Что было настроено

✅ **Docker контейнеризация** - оптимизированный Dockerfile с multi-stage сборкой  
✅ **Nginx конфигурация** - кэширование, rate limiting, безопасность  
✅ **PostgreSQL база данных** - с автоматической инициализацией из дампа  
✅ **Docker Compose** - полная инфраструктура в одном файле  
✅ **Скрипты автоматизации** - деплой, настройка бота, разработка  
✅ **Переменные окружения** - готовая конфигурация для продакшена  

## 🎯 Пошаговое развертывание

### 1. Подготовка сервера (Ubuntu/Debian)

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагружаемся
sudo reboot
```

### 2. Загрузка проекта на сервер

```bash
# Клонируем проект
git clone <your-repo-url> plusgames
cd plusgames

# Или загружаем архив
# wget <your-archive-url>
# unzip plusgames.zip
# cd plusgames
```

### 3. Настройка переменных окружения

```bash
# Копируем конфигурацию
cp env.example .env

# Редактируем настройки
nano .env
```

**Обязательно заполните:**
- `TELEGRAM_BOT_TOKEN` - токен бота от @BotFather
- `TELEGRAM_WEBAPP_URL` - ваш домен (например: https://yourdomain.com)
- `DB_PASSWORD` - надежный пароль для базы данных
- `NEXTAUTH_SECRET` - случайная строка для безопасности

### 4. Создание Telegram Bot

1. Откройте @BotFather в Telegram
2. Отправьте `/newbot`
3. Введите имя: "PlusGames Bot"
4. Введите username: "plusgames_bot"
5. Скопируйте токен в `.env` файл

### 5. Развертывание

```bash
# Делаем скрипты исполняемыми
chmod +x deploy.sh setup-telegram-bot.sh dev.sh

# Запускаем развертывание
./deploy.sh production
```

### 6. Настройка Telegram Bot

```bash
# Настраиваем бота для работы с Web App
./setup-telegram-bot.sh
```

## 🔧 Управление приложением

### Основные команды

```bash
# Запуск в продакшене
./deploy.sh production

# Запуск в режиме разработки
./dev.sh

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Перезапуск
docker-compose restart
```

### Мониторинг

```bash
# Статус сервисов
docker-compose ps

# Использование ресурсов
docker stats

# Логи конкретного сервиса
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f postgres
```

## 🌐 Настройка домена

1. **Получите домен** (например, через Cloudflare, Namecheap, etc.)
2. **Настройте DNS** - укажите A-запись на IP вашего сервера
3. **Обновите .env** - измените `TELEGRAM_WEBAPP_URL` на ваш домен
4. **Перезапустите** - `docker-compose restart`

## 🔒 SSL сертификат (рекомендуется)

```bash
# Устанавливаем Certbot
sudo apt install certbot

# Получаем сертификат
sudo certbot certonly --standalone -d yourdomain.com

# Обновляем nginx.conf для HTTPS
# (добавьте SSL конфигурацию)
```

## 📊 Проверка работы

1. **Откройте браузер** - перейдите на ваш домен
2. **Проверьте API** - `https://yourdomain.com/api/health`
3. **Протестируйте бота** - отправьте `/start` вашему боту
4. **Проверьте Web App** - нажмите кнопку в боте

## 🚨 Устранение неполадок

### Приложение не запускается
```bash
# Проверяем логи
docker-compose logs app

# Проверяем переменные окружения
docker-compose exec app env | grep TELEGRAM
```

### База данных не подключается
```bash
# Проверяем статус PostgreSQL
docker-compose exec postgres pg_isready -U plusgames_user

# Проверяем подключение
docker-compose exec app node -e "console.log(process.env.DATABASE_URL)"
```

### Telegram Bot не работает
```bash
# Проверяем токен
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

# Перезапускаем настройку бота
./setup-telegram-bot.sh
```

## 📈 Оптимизация

### Для высоких нагрузок
- Используйте VPS с 4GB+ RAM
- Настройте Redis для кэширования
- Используйте CDN для статических файлов
- Настройте мониторинг (Prometheus + Grafana)

### Безопасность
- Регулярно обновляйте зависимости
- Используйте сильные пароли
- Настройте firewall (ufw)
- Создавайте регулярные бэкапы

## 🎉 Готово!

Ваш Telegram Mini App готов к работе! 

**Следующие шаги:**
1. Протестируйте все функции
2. Настройте мониторинг
3. Создайте резервные копии
4. Настройте автоматические обновления

**Полезные ссылки:**
- [Документация Next.js](https://nextjs.org/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://nginx.org/en/docs/)
