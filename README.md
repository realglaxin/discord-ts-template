# 🤖 All-in-One Discord.js v14 TypeScript Bot Template

A fully-featured and scalable Discord bot template using **Discord.js v14**, **TypeScript**, **MongoDB**, and **hybrid command support** (slash + prefix). Perfect for kickstarting a modern, production-ready Discord bot.

---

## 🚀 Features

- ✅ Built with **TypeScript** for type safety and scalability  
- 🔧 Supports **hybrid commands** (slash + prefix)  
- 🧩 **Modular command/event handler** structure  
- 📦 MongoDB integration via **Mongoose**  
- 🌐 **Built-in Discord sharding** for scalability across large bots  
- 🧪 Includes sample commands and events  
- ✨ Clean folder structure and codebase  
- 🛡️ Permission & error handling  
- 🔁 Ready for production deployment

---

## 🛠️ Installation

Follow these steps to set up and run the bot locally:

1. **Clone the repository**

```bash
git clone https://github.com/realglaxin/discord-ts-template.git
cd discord-ts-template
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure the bot**

Rename the example config file and fill in your settings:

```bash
mv src/config/config.example.ts src/config/config.ts
```

Now edit `src/config/config.ts` and fill in the details.

4. **Start the bot (auto-compile)**

```bash
npm run dev
```

This will automatically compile TypeScript and run the bot.

---