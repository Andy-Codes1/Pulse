# 🚀 Pulse — AI-Powered P2P Remittance MVP

> Cross-border payments from the US to Mexico in under 60 seconds, with AI budgeting, investment recommendations, credit building, and multi-language support.

![Pulse Demo](https://img.shields.io/badge/Status-Investor_Demo-6366F1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)
![Capacitor](https://img.shields.io/badge/iOS-Capacitor_6-000?style=flat-square&logo=apple)

---

## ✨ Features

| Module | Feature | Description |
|--------|---------|-------------|
| 1–5 | **Remittance Flow** | Full send/receive with animated processing pipeline |
| 6 | **Budget Guard** | AI safe-to-send limits with soft warnings |
| 7 | **Opportunity Engine** | AI micro-investment recommendations |
| 8 | **AI Assistant** | Chat interface powered by Claude/Gemini API |
| 9 | **Credit Builder** | Build US credit via remittance history + AI letters |
| 10 | **Lingo Error Handler** | AI-translated banking error explanations |
| 🌐 | **Multi-Language** | English, Español, Português, Français, 中文, العربية (RTL) |

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **AI:** Anthropic Claude API (swappable to Gemini)
- **iOS:** Capacitor 6 (native Xcode project)
- **Payment Rails (simulated):** Stripe → Circle/USDC → Solana → Visa Direct

---

## 📋 Prerequisites

Before starting, make sure you have these installed:

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) |
| **npm** | 9+ | Comes with Node |
| **Git** | 2+ | [git-scm.com](https://git-scm.com) |
| **Xcode** | 15+ | Mac App Store *(iOS only)* |
| **CocoaPods** | 1.14+ | `sudo gem install cocoapods` *(iOS only)* |

---

## 🚀 Quick Start (Web)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/pulse-mvp.git
cd pulse-mvp

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. That's it!

---

## 📱 Running in Xcode (iOS)

Capacitor wraps the web app in a native iOS shell so it runs as a real iPhone app.

### Step-by-step:

```bash
# 1. Install dependencies (if you haven't already)
npm install

# 2. Build the web app
npm run build

# 3. Add the iOS platform (first time only)
npx cap add ios

# 4. Sync your build into the Xcode project
npx cap sync ios

# 5. Open in Xcode
npx cap open ios
```

### Or use the shortcut:
```bash
npm run ios:run
```

### In Xcode:

1. **Xcode will open** with the `ios/App/App.xcworkspace` file
2. Select your **target device** (iPhone 15 Pro, simulator, or your physical device)
3. Click the **▶ Play** button (or `Cmd + R`) to build and run
4. The app will launch on your device/simulator

### Running on a physical iPhone:

1. Connect your iPhone via USB
2. In Xcode: **Signing & Capabilities** → select your Apple Developer Team
3. On your iPhone: **Settings → General → VPN & Device Management** → trust the developer certificate
4. Hit ▶ Play in Xcode

### Updating after code changes:

```bash
# Rebuild web → sync → Xcode auto-refreshes
npm run ios:sync
```

Then hit ▶ Play again in Xcode.

---

## 🐙 Pushing to GitHub

### First time setup:

```bash
# 1. Create a new repo on github.com (don't add README)

# 2. Initialize git in this project
cd pulse-mvp
git init
git add .
git commit -m "Initial commit: Pulse MVP with AI modules 1-10"

# 3. Connect to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/pulse-mvp.git

# 4. Push
git branch -M main
git push -u origin main
```

### After making changes:

```bash
git add .
git commit -m "description of changes"
git push
```

---

## 📁 Project Structure

```
pulse-mvp/
├── index.html              # Entry HTML (Vite)
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite bundler config
├── tsconfig.json           # TypeScript config
├── capacitor.config.json   # iOS/Capacitor config
├── .gitignore
├── src/
│   ├── main.tsx            # React mount point
│   ├── App.tsx             # App wrapper
│   └── PulseApp.tsx        # ⭐ Main demo (all modules)
├── dist/                   # Built output (auto-generated)
└── ios/                    # Xcode project (auto-generated)
    └── App/
        ├── App.xcworkspace # ← Open this in Xcode
        ├── App/
        └── Pods/
```

---

## 🔑 AI API Configuration

The demo calls the Anthropic Claude API for:
- AI chat assistant responses
- Credit letter generation
- Error explanations

**For the investor demo**, the API calls will fall back to realistic hardcoded responses if the API is unavailable, so it works offline too.

**To connect Gemini instead**, update the `callAI` function in `PulseApp.tsx`:

```typescript
// Replace the fetch URL and payload:
const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  }),
});
```

---

## 🎨 Customization

| What | Where | How |
|------|-------|-----|
| Balance | `PulseApp.tsx` line ~77 | Change `INITIAL_BALANCE` |
| FX Rate | `PulseApp.tsx` line ~76 | Change `FX_RATE` |
| Contacts | `PulseApp.tsx` | Edit `CONTACTS` array |
| Languages | `PulseApp.tsx` | Edit `T` translations object |
| Safe limit | `PulseApp.tsx` | Change `SAFE_AMT` |
| Investments | `PulseApp.tsx` | Edit `getSuggestions()` |
| Credit history | `PulseApp.tsx` | Edit `CREDIT_HISTORY` |

---

## 🏗️ Deployment Options

| Platform | Command | Notes |
|----------|---------|-------|
| **Local dev** | `npm run dev` | Hot reload at localhost:3000 |
| **iOS app** | `npm run ios:run` | Opens in Xcode → run on device |
| **Vercel** | `vercel --prod` | One-click deploy |
| **Netlify** | Push to GitHub + connect | Auto-deploys on push |
| **GitHub Pages** | Add `base: '/pulse-mvp/'` to vite.config.ts | Free hosting |

---

## 📄 License

MIT — built for Pulse Financial.
