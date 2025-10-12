# 🐳 Руководство по развертыванию с Docker

## 🎯 Простой способ развертывания

Теперь вам **НЕ НУЖНО** устанавливать PostgreSQL отдельно! Все работает в Docker контейнерах.

## 🚀 Быстрый старт

### 1. Установите Docker Desktop
- Скачайте с [docker.com](https://www.docker.com/products/docker-desktop/)
- Установите и запустите Docker Desktop

### 2. Настройте проект
```cmd
# Создайте .env файл
copy env.example .env
notepad .env
```

### 3. Заполните .env файл
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
TELEGRAM_WEBAPP_URL=https://yourdomain.com
DB_PASSWORD=надежный_пароль
NEXTAUTH_SECRET=случайная_строка
```

### 4. Запустите развертывание

#### Вариант A: Полное развертывание (рекомендуется)
```cmd
# PowerShell
.\docker-deploy.ps1

# CMD
docker-deploy.bat
```

#### Вариант B: Только для разработки
```cmd
# PowerShell
.\docker-dev.ps1

# CMD
docker-dev.bat
```

## 🔧 Что происходит

### При полном развертывании:
1. **PostgreSQL** - база данных в Docker контейнере
2. **Next.js App** - ваше приложение в Docker контейнере  
3. **Nginx** - веб-сервер в Docker контейнере
4. **Автоматическая настройка** - все сервисы настраиваются автоматически

### При разработке:
1. **PostgreSQL** - база данных в Docker контейнере
2. **Next.js App** - запускается локально для разработки

## 📊 Управление

### Основные команды
```cmd
# Запуск всех сервисов
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart

# Статус сервисов
docker-compose ps
```

### Управление отдельными сервисами
```cmd
# Только PostgreSQL
docker-compose up -d postgres

# Только приложение
docker-compose up -d app

# Только Nginx
docker-compose up -d nginx
```

## 🗄️ База данных

### Подключение к PostgreSQL
```cmd
# Через Docker
docker-compose exec postgres psql -U plusgames_user -d plusgames

# Создание бэкапа
docker-compose exec postgres pg_dump -U plusgames_user plusgames > backup.sql

# Восстановление из бэкапа
docker-compose exec -T postgres psql -U plusgames_user plusgames < backup.sql
```

### Данные сохраняются
- Все данные PostgreSQL сохраняются в Docker volume
- При перезапуске данные не теряются
- Для полного удаления: `docker-compose down -v`

## 🌐 Доступ к сервисам

- **Приложение**: http://localhost:3000
- **Nginx (если запущен)**: http://localhost
- **PostgreSQL**: localhost:5432

## 🔧 Устранение неполадок

### Приложение не запускается
```cmd
# Проверьте логи
docker-compose logs app

# Проверьте статус
docker-compose ps

# Перезапустите
docker-compose restart
```

### База данных не подключается
```cmd
# Проверьте PostgreSQL
docker-compose logs postgres

# Проверьте подключение
docker-compose exec postgres pg_isready -U plusgames_user
```

### Проблемы с портами
```cmd
# Проверьте, какие порты заняты
netstat -an | findstr :3000
netstat -an | findstr :5432
netstat -an | findstr :80
```

## 📈 Преимущества Docker

✅ **Простота** - не нужно устанавливать PostgreSQL  
✅ **Изоляция** - все сервисы работают отдельно  
✅ **Портативность** - работает на любой системе  
✅ **Масштабируемость** - легко добавить новые сервисы  
✅ **Воспроизводимость** - одинаково работает везде  

## 🎉 Готово!

Теперь у вас есть полностью настроенная инфраструктура в Docker:

- 🐘 **PostgreSQL** - база данных
- 🚀 **Next.js** - ваше приложение  
- 🌐 **Nginx** - веб-сервер
- 🔧 **Автоматизация** - скрипты для управления

**Просто запустите `docker-deploy.bat` и все заработает!** 🚀
