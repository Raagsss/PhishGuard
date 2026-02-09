# 🔐 Phishing Link Scanner

<div align="center">

![Phishing Scanner](https://img.shields.io/badge/Security-Phishing%20Detection-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Instantly detect phishing links and malicious URLs with advanced security analysis**

</div>

---

## 🎯 About

A **production-ready web application** that analyzes URLs for phishing indicators using cybersecurity best practices. Built to showcase **full-stack development** and **security engineering** skills.

Perfect for:
- 🎓 **Student Projects & Portfolios**
- 💼 **Interview Demonstrations**
- 🛡️ **Real-world Security Tool**
- 📚 **Learning Cybersecurity**

---

## ✨ Features

### 🔍 Advanced Detection Logic

- ✅ **HTTPS Validation** - Detects insecure HTTP connections
- ✅ **IP-based URL Detection** - Flags suspicious numeric addresses
- ✅ **URL Shortener Detection** - Identifies hidden destinations
- ✅ **Typosquatting Detection** - Catches fake domains (paypaI.com vs paypal.com)
- ✅ **Suspicious Keyword Analysis** - Scans for phishing terms
- ✅ **Special Character Analysis** - Detects obfuscation techniques
- ✅ **Subdomain Analysis** - Identifies excessive subdomain nesting
- ✅ **URL Length Validation** - Flags abnormally long URLs
- ✅ **Port Number Analysis** - Detects non-standard ports

### 🎨 Modern UI/UX

- 🌈 Beautiful gradient design with Tailwind CSS
- ⚡ Smooth animations with Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎭 Real-time scanning feedback
- 📊 Interactive stats dashboard

### 🛡️ Security Features

- 🚦 **Rate Limiting** - Prevents abuse (100 requests/15min)
- 🔒 **Helmet.js** - Security headers
- 📝 **Activity Logging** - Tracks suspicious URLs
- 🎯 **Risk Scoring System** (0-100 scale)

---

## 🚀 Demo

### Safe URL
```
Input: https://google.com
Output: ✅ Safe Link (Risk Score: 0)
```

### Phishing URL
```
Input: http://paypaI-verification.com/login
Output: 🚨 Dangerous Link (Risk Score: 78)
Reasons:
- Typosquatting detected (similar to paypal.com)
- No HTTPS encryption
- Suspicious keyword: "login"
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite (⚡ blazing fast)
- **Tailwind CSS** - Modern styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios** - API requests

### Backend
- **Node.js** + **Express** - Server framework
- **Helmet.js** - Security middleware
- **Express Rate Limit** - DDoS protection
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin support

### Security Concepts Used
- 🔐 OWASP Top 10 awareness
- 🧠 Levenshtein distance algorithm (typosquatting)
- 🎯 Heuristic-based threat detection
- 📊 Risk scoring system
- 🚦 Rate limiting & abuse prevention

---

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/phishing-scanner.git
cd phishing-scanner
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:3000`

### Step 5: Open Browser
Navigate to `http://localhost:3000` and start scanning! 🚀

---

## 🧠 How It Works

### Detection Pipeline

```
URL Input → Normalization → Analysis Checks → Risk Scoring → Result Generation
```

### Risk Scoring

| Check | Risk Points |
|-------|-------------|
| No HTTPS | +20 |
| IP-based URL | +25 |
| URL Shortener | +15 |
| Suspicious Keywords | +8 each (max 25) |
| Typosquatting | +30 |
| Excessive Special Chars | +15 |
| Long URL (>150 chars) | +15 |
| Multiple Subdomains | +12 |
| Non-standard Port | +10 |

**Risk Levels:**
- 🟢 **Safe**: 0-20 points
- 🟡 **Suspicious**: 21-50 points
- 🔴 **Dangerous**: 51+ points

### Example Analysis

**Input:** `http://192.168.1.1/secure-login-paypal`

**Detected Issues:**
1. No HTTPS (+20)
2. IP address used (+25)
3. Suspicious keywords: "secure", "login", "paypal" (+24)

**Total Score:** 69 → 🔴 **Dangerous**

---

## 📁 Project Structure

```
phishing-scanner/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   │   ├── Scanner.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Features.jsx
│   │   │   └── Stats.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/              # Node.js backend
│   ├── server.js        # Express app
│   ├── scanner.js       # Detection engine
│   └── package.json
│
└── README.md
```

---

## 🎓 Resume-Ready Description

> **Phishing Link Scanner** | React, Node.js, Express, Cybersecurity
>
> Developed a full-stack web application that analyzes URLs for malicious patterns including typosquatting, insecure protocols, IP-based links, and suspicious keywords. Implemented advanced detection algorithms (Levenshtein distance), risk scoring system (0-100 scale), rate limiting, and security middleware. Features modern responsive UI with React, Tailwind CSS, and Framer Motion animations.
>
> **Tech:** React, Node.js, Express, API design, OWASP Top 10, Rate Limiting, Security Headers
>
> **Impact:** Detects 9+ phishing indicators in real-time with instant visual feedback

---

## 🚀 Future Enhancements

- [ ] Browser extension (Chrome/Firefox)
- [ ] Machine learning model integration
- [ ] Domain age checking (WHOIS API)
- [ ] SSL certificate validation
- [ ] Historical URL database (MongoDB)
- [ ] User reporting system
- [ ] Export scan reports (PDF)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

---

## 📄 License

MIT License - feel free to use this project for learning, portfolios, or commercial purposes.

---

## 👨‍💻 Author

Built with ❤️ for cybersecurity education

**Connect:**
- GitHub: [@Raagsss](https://github.com/Raagsss)

---

## ⭐ Show Your Support

If this project helped you learn or land an interview, give it a star! ⭐

---

<div align="center">

**Protecting users from phishing attacks, one URL at a time** 🛡️

Made with React • Node.js • Cybersecurity • Love

</div>
