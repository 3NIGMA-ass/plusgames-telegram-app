# 🎮 PlusGames - Telegram Mini App

Инвестиционная платформа с высокими доходами, созданная как Telegram Mini App.

## 🚀 Развертывание на Vercel

### 1. Подготовка базы данных
1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В SQL Editor выполните скрипт из файла `plusgames.dump` (структура БД)
4. В настройках Database → Connect → Transaction pooler
5. Скопируйте DATABASE_URL (формат: `postgresql://postgres.xxx:password@xxx.supabase.co:6543/postgres`)

### 2. Создание Telegram Bot
1. Откройте @BotFather в Telegram
2. Отправьте `/newbot`
3. Введите имя бота (например: "PlusGames Bot")
4. Введите username (например: "plusgames_bot")
5. Скопируйте токен из ответа BotFather

### 3. Загрузка на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git push -u origin main
```

### 4. Деплой на Vercel

#### 4.1 Первый раз (создание проекта)
1. Зайдите на [vercel.com](https://vercel.com) и войдите через GitHub
2. Нажмите **Import Project**
3. Выберите ваш GitHub репозиторий
4. В **Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Build Command: (оставьте пустым)
   - Output Directory: (оставьте пустым)
   - Install Command: `npm install --legacy-peer-deps --force`
   - Node.js Version: `20.x`

5. Добавьте **Environment Variables**:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
   TELEGRAM_WEBAPP_URL=https://временный-url.vercel.app
   DATABASE_URL=postgresql://postgres.xxx:password@xxx.supabase.co:6543/postgres
   NEXTAUTH_URL=https://временный-url.vercel.app
   NEXTAUTH_SECRET=сгенерируйте_случайную_строку_32_символа
   ```
   
   💡 Для генерации `NEXTAUTH_SECRET` используйте:
   ```bash
   openssl rand -base64 32
   ```

6. Нажмите **Deploy**
7. После успешного деплоя скопируйте финальный URL (например: `https://your-project.vercel.app`)
8. Обновите переменные окружения:
   - `TELEGRAM_WEBAPP_URL` → замените на финальный URL
   - `NEXTAUTH_URL` → замените на финальный URL
9. Откройте **Deployments** → три точки у последнего деплоя → **Redeploy**

#### 4.2 Обновление проекта
После каждого изменения кода:

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```

Затем в Vercel:
1. Откройте ваш проект
2. Откройте **Deployments**
3. Найдите последний деплой → три точки → **Redeploy**
4. ✅ **ОБЯЗАТЕЛЬНО отметьте "Clear Build Cache"**
5. Нажмите **Redeploy**

### 5. Настройка Telegram Bot
1. Откройте @BotFather в Telegram
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. Отправьте URL: `https://your-project.vercel.app`

### 6. Запуск бота
1. Откройте вашего бота в Telegram
2. Нажмите **Start** или на кнопку меню
3. Приложение откроется как Mini App

## 🔧 Локальная разработка

```bash
# Клонирование репозитория
git clone https://github.com/ваш-username/ваш-репозиторий.git
cd ваш-репозиторий

# Установка зависимостей
npm install --legacy-peer-deps --force

# Создание .env файла
cp .env.example .env

# Заполните .env файл:
# TELEGRAM_BOT_TOKEN=...
# TELEGRAM_WEBAPP_URL=http://localhost:3000
# DATABASE_URL=...
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=...

# Запуск в режиме разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📱 Структура проекта

```
app/
├── cabinet/          # Страница инвестиционного кабинета
├── learning/         # Страница обучения
├── partners/         # Реферальная программа
├── wallet/           # Кошелек
├── api/             # API эндпоинты
├── lib/             # Утилиты и хелперы
├── ui/              # UI компоненты
│   ├── banners/     # Баннеры
│   ├── cabinet/     # Компоненты кабинета
│   ├── layout/      # Layouts (header, footer, navigation)
│   ├── main/        # Компоненты главной страницы
│   ├── modals/      # Модальные окна
│   ├── partners/    # Компоненты реферальной программы
│   └── wallet/      # Компоненты кошелька
└── context/         # React контексты
```

## ⚙️ Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **PostgreSQL** - База данных
- **Vercel** - Хостинг
- **Telegram Mini Apps SDK** - Интеграция с Telegram

## ⚠️ Важные замечания

1. **Кеширование**: Всегда очищайте Build Cache в Vercel при обновлении
2. **Демо-режим**: Приложение работает в демо-режиме если открыто не через Telegram
3. **База данных**: Используйте Transaction Pooler от Supabase для стабильности
4. **Node.js**: Используйте версию 20.x для совместимости

## 🐛 Решение проблем

### Ошибка "Module not found" в Vercel
- Убедитесь что Install Command: `npm install --legacy-peer-deps --force`
- Очистите Build Cache и сделайте Redeploy

### Приложение не открывается в Telegram
- Проверьте что TELEGRAM_WEBAPP_URL совпадает с URL вашего Vercel проекта
- Убедитесь что выполнили `/setmenubutton` в @BotFather
- Попробуйте обновить WebApp через @BotFather: `/setmenubutton` → выберите бота → отправьте URL еще раз

### Бесконечная загрузка
- Проверьте правильность DATABASE_URL
- Убедитесь что база данных доступна
- Проверьте логи в Vercel Dashboard → Functions → Logs

### Ошибки сборки
- Проверьте что Node.js Version: `20.x`
- Убедитесь что Install Command содержит `--legacy-peer-deps --force`
- Очистите Build Cache

## 📄 Лицензия

Проект создан в учебных целях.

## 👨‍💻 Разработка

При разработке:
- Используйте `npm run dev` для локального сервера
- Используйте `npm run build` для проверки сборки перед деплоем
- Всегда тестируйте через Telegram Mini App перед релизом
