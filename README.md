# 🎮 PlusGames - Telegram Mini App

Инвестиционная платформа с высокими доходами, созданная как Telegram Mini App.

## ⚠️ Важные замечания

- При деплое обязательно кэш + проброс статики через nginx, иначе next-server будет отваливаться постоянно при 5+ пользователей
- Могут быть проблемы при начислении накоплений при входе, дубликаты и тп
- `plusgames.dump` - дамп БД со всей структурой

## 🚀 Быстрый старт

### 🐳 С Docker (Рекомендуется)

#### Windows
```cmd
# 1. Установите Docker Desktop
# 2. Создайте .env файл
copy env.example .env
notepad .env

# 3. Запустите развертывание
docker-deploy.bat

# 4. Настройте Telegram Bot
setup-bot.bat
```

#### Linux/macOS
```bash
# 1. Установите Docker
# 2. Создайте .env файл
cp env.example .env
nano .env

# 3. Запустите развертывание
chmod +x deploy.sh setup-telegram-bot.sh
./deploy.sh production
./setup-telegram-bot.sh
```

### 🔧 Без Docker (Альтернатива)

#### Windows
```cmd
# Создайте .env файл
copy env.example .env
notepad .env

# Запустите развертывание
deploy.bat

# Настройте Telegram Bot
setup-bot.bat
```

#### Linux/macOS
```bash
# Создайте .env файл
cp env.example .env
nano .env

# Запустите развертывание
chmod +x deploy.sh setup-telegram-bot.sh
./deploy.sh production
./setup-telegram-bot.sh
```

## 📚 Документация

- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - 🐳 **Руководство по Docker (Рекомендуется)**
- [WINDOWS_QUICK_START.md](WINDOWS_QUICK_START.md) - Быстрый старт для Windows
- [QUICK_START.md](QUICK_START.md) - Быстрый старт для Linux
- [DEPLOYMENT.md](DEPLOYMENT.md) - Подробная документация по развертыванию
- [WINDOWS_DEPLOYMENT.md](WINDOWS_DEPLOYMENT.md) - Развертывание на Windows
- [FIXES.md](FIXES.md) - Исправления и решения проблем

## 🔧 Установка зависимостей

### Windows
```cmd
# PowerShell
.\install-deps.ps1

# CMD
install-deps.bat
```

### Linux/macOS
```bash
npm install --legacy-peer-deps
```















This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
