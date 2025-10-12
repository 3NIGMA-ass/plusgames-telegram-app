# 🚀 Развертывание PlusGames Telegram Mini App

Этот документ содержит пошаговые инструкции по развертыванию вашего Telegram Mini App на сервере.

## 📋 Предварительные требования

- Docker и Docker Compose установлены на сервере
- Домен с SSL сертификатом (рекомендуется)
- Telegram Bot Token (получить через @BotFather)
- Сервер с минимум 2GB RAM и 20GB дискового пространства

## 🛠️ Быстрый старт

### 1. Подготовка сервера

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

# Перезагружаемся для применения изменений
sudo reboot
```

### 2. Клонирование и настройка проекта

```bash
# Клонируем проект (замените на ваш репозиторий)
git clone <your-repo-url> plusgames
cd plusgames

# Копируем файл конфигурации
cp env.example .env

# Редактируем переменные окружения
nano .env
```

### 3. Настройка переменных окружения

Отредактируйте файл `.env`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBAPP_URL=https://yourdomain.com

# Database Configuration
DB_PASSWORD=your_secure_password_here

# Next.js Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key_here

# Production Configuration
NODE_ENV=production
```

### 4. Создание Telegram Bot

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newbot`
3. Введите имя бота (например: "PlusGames Bot")
4. Введите username бота (например: "plusgames_bot")
5. Скопируйте полученный токен в файл `.env`

### 5. Развертывание приложения

```bash
# Делаем скрипты исполняемыми
chmod +x deploy.sh setup-telegram-bot.sh

# Запускаем развертывание
./deploy.sh production
```

### 6. Настройка Telegram Bot

```bash
# Настраиваем бота для работы с Web App
./setup-telegram-bot.sh
```

## 🔧 Дополнительная настройка

### Настройка SSL (HTTPS)

Для продакшена рекомендуется настроить SSL сертификат:

```bash
# Устанавливаем Certbot
sudo apt install certbot

# Получаем сертификат
sudo certbot certonly --standalone -d yourdomain.com

# Обновляем nginx.conf для HTTPS
# (добавьте SSL конфигурацию в nginx.conf)
```

### Настройка домена

1. Укажите A-запись вашего домена на IP сервера
2. Обновите `TELEGRAM_WEBAPP_URL` в файле `.env`
3. Перезапустите приложение: `docker-compose restart`

## 📊 Мониторинг и обслуживание

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f postgres
```

### Обновление приложения

```bash
# Останавливаем сервисы
docker-compose down

# Обновляем код
git pull origin main

# Пересобираем и запускаем
./deploy.sh production
```

### Резервное копирование базы данных

```bash
# Создаем бэкап
docker-compose exec postgres pg_dump -U plusgames_user plusgames > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстанавливаем из бэкапа
docker-compose exec -T postgres psql -U plusgames_user plusgames < backup_file.sql
```

## 🚨 Устранение неполадок

### Приложение не запускается

1. Проверьте логи: `docker-compose logs app`
2. Убедитесь, что все переменные окружения установлены
3. Проверьте доступность базы данных: `docker-compose logs postgres`

### База данных не подключается

1. Проверьте, что PostgreSQL запущен: `docker-compose ps`
2. Убедитесь, что пароль в `.env` правильный
3. Проверьте подключение: `docker-compose exec app node -e "console.log(process.env.DATABASE_URL)"`

### Telegram Bot не работает

1. Убедитесь, что токен правильный
2. Проверьте, что Web App URL доступен извне
3. Запустите настройку бота: `./setup-telegram-bot.sh`

## 📈 Оптимизация производительности

### Настройка кэширования

Nginx уже настроен для агрессивного кэширования статических файлов. Для дополнительной оптимизации:

1. Включите Redis для кэширования данных
2. Настройте CDN для статических ресурсов
3. Оптимизируйте изображения

### Масштабирование

Для высоких нагрузок:

1. Используйте несколько экземпляров приложения
2. Настройте load balancer
3. Используйте внешнюю базу данных (например, AWS RDS)

## 🔒 Безопасность

1. Регулярно обновляйте зависимости
2. Используйте сильные пароли
3. Настройте firewall
4. Регулярно создавайте бэкапы
5. Мониторьте логи на предмет подозрительной активности

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи приложения
2. Убедитесь, что все сервисы запущены
3. Проверьте конфигурацию переменных окружения
4. Обратитесь к документации Docker и Next.js
