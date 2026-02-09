# 🚀 Quick Start (No Database Required)

## Simple Setup - Just Run It!

### 1. Install Dependencies

**Server:**
```powershell
cd server
npm install
```

**Client:**
```powershell
cd client
npm install
```

### 2. Start the App

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

### 3. Open Browser
Go to: **http://localhost:3000**

That's it! 🎉 The app works perfectly without MongoDB/Redis.

---

## What Works Without Database

✅ URL scanning with all detection features  
✅ Real-time results  
✅ Beautiful UI  
✅ Risk scoring  
✅ Stats (in-memory)  

❌ Login/OAuth  
❌ Scan history  
❌ API keys  
❌ PDF reports  
❌ Queue system  

**This is perfect for:**
- Portfolio demos
- Local testing
- Learning cybersecurity
- Interview presentations

---

## Want Advanced Features? (Optional)

If you want login, history, and API keys, you'll need:

1. **MongoDB** - For storing scans and users
2. **Redis** - For queue/worker system

### Install MongoDB (Windows)
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Or use Docker:
docker run -d -p 27017:27017 mongo
```

### Install Redis (Windows)
```powershell
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use Docker:
docker run -d -p 6379:6379 redis
```

### Configure Environment
```powershell
cd server
copy .env.example .env
# Edit .env and uncomment MongoDB/Redis lines
```

### Run Worker (for queue system)
```powershell
cd server
npm run worker
```

---

## Troubleshooting

### "Module not found" error
```powershell
cd server
npm install
cd ../client
npm install
```

### Port already in use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

### Can't connect to backend
Make sure:
1. Backend is running on port 5000
2. Frontend is running on port 3000
3. Check browser console for errors

---

## Features Showcase

**Try these test URLs:**
- `https://github.com` - Should be SAFE
- `http://paypaI-verification.com` - DANGEROUS (typosquatting)
- `http://192.168.1.1/login` - SUSPICIOUS (IP-based)
- `http://bit.ly/test` - SUSPICIOUS (URL shortener)

---

**Happy Scanning! 🛡️**
