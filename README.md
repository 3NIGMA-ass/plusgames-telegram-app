# 🎮 PlusGames - Telegram Mini App

Инвестиционная платформа с высокими доходами, созданная как Telegram Mini App.

## ⚠️ Важные замечания

- При деплое обязательно кэш + проброс статики через nginx, иначе next-server будет отваливаться постоянно при 5+ пользователей
- Могут быть проблемы при начислении накоплений при входе, дубликаты и тп
- `plusgames.dump` - дамп БД со всей структурой

## 🚀 Развертывание на Vercel

### 1. Подготовка базы данных
1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В настройках Database → Connect → Transaction pooler
4. Скопируйте DATABASE_URL

### 2. Загрузка на GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. Деплой на Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Import Project → выберите ваш GitHub репозиторий
3. Настройте переменные окружения:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
   TELEGRAM_WEBAPP_URL=https://your-project.vercel.app
   DATABASE_URL=postgresql://postgres.xxx:password@xxx.supabase.co:6543/postgres
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=случайная_строка_32_символа
   ```
4. Нажмите Deploy

### 4. Настройка Telegram Bot
1. Откройте @BotFather в Telegram
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. Укажите URL: `https://your-project.vercel.app`

## 🔧 Локальная разработка

```bash
# Установка зависимостей
npm install --legacy-peer-deps

# Запуск в режиме разработки
npm run dev
```

## 📱 Создание Telegram Bot

1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/newbot`
4. Введите имя: "PlusGames Bot"
5. Введите username: "plusgames_bot"
6. Скопируйте токен в переменные окружения