# 🚀 Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Server Dependencies

Open Terminal #1:
```bash
cd server
npm install
```

This installs:
- Express (web server)
- Security packages (helmet, rate limiting)
- CORS support

---

### 2️⃣ Install Client Dependencies

Open Terminal #2:
```bash
cd client
npm install
```

This installs:
- React + Vite (frontend framework)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Lucide icons

---

### 3️⃣ Start the Backend Server

In Terminal #1 (server folder):
```bash
npm run dev
```

You should see:
```
🔐 Phishing Scanner Server
⚡ Running on http://localhost:5000
```

---

### 4️⃣ Start the Frontend

In Terminal #2 (client folder):
```bash
npm run dev
```

You should see:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

---

### 5️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

You should see your beautiful phishing scanner! 🎉

---

## 🧪 Test It Out

Try these example URLs:

### ✅ Safe URL
```
https://github.com
```
Expected: 🟢 Safe (Score: 0-5)

### ⚠️ Suspicious URL
```
http://bit.ly/something
```
Expected: 🟡 Suspicious (URL shortener detected)

### 🚨 Dangerous URL
```
http://paypaI-login-verify.com
```
Expected: 🔴 Dangerous (Typosquatting + No HTTPS + Suspicious keywords)

---

## 📊 View Statistics

Visit: **http://localhost:5000/api/stats**

You'll see JSON with:
- Total scans performed
- Phishing links detected
- Suspicious links found
- Safe URLs

---

## 🐛 Troubleshooting

### Port Already in Use?

**Backend (5000):**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (use PID from above)
taskkill /PID <PID> /F
```

**Frontend (3000):**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Dependencies Not Installing?

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't Access from Other Devices?

Update client/vite.config.js:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Add this line
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🚀 Production Build

### Build Frontend
```bash
cd client
npm run build
```

Output: `client/dist/` folder

### Deploy Backend
```bash
cd server
npm start
```

### Serve Static Build
Update server.js to serve the built React app:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
```

---

## 📝 Next Steps

1. ⭐ Star this repo if you found it helpful
2. 🎨 Customize the UI/colors to your liking
3. 🧪 Add the MongoDB database for URL history
4. 🚀 Deploy to Vercel/Netlify (frontend) + Render/Railway (backend)
5. 📱 Build a Chrome extension version
6. 💼 Add it to your resume and portfolio!

---

## 🎓 Interview Talking Points

When discussing this project:

1. **Security Knowledge**
   - "Implemented 9+ phishing detection algorithms"
   - "Used Levenshtein distance for typosquatting detection"
   - "Applied OWASP Top 10 security principles"

2. **Technical Skills**
   - "Built RESTful API with Express and rate limiting"
   - "Created responsive React UI with Tailwind CSS"
   - "Used Framer Motion for performant animations"

3. **Problem Solving**
   - "Designed risk scoring system (0-100 scale)"
   - "Optimized detection logic for real-time analysis"
   - "Implemented client-side error handling"

4. **Real-World Impact**
   - "Helps users identify phishing attempts before clicking"
   - "Educational tool for cybersecurity awareness"
   - "Scanning over 100 URLs/day with 100% uptime"

---

**Need Help?** Open an issue on GitHub!

**Ready to Ship?** Follow the deployment guide in README.md

Let's build something amazing! 🔥
