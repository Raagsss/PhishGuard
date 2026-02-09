# Phishing Scanner - Installation & Setup

## Minimum Requirements (No Database)

Just Node.js 18+ and npm. That's it!

## Installation

```powershell
# 1. Install server dependencies
cd server
npm install

# 2. Install client dependencies
cd ../client
npm install
```

## Running the App

```powershell
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Open: http://localhost:3000

---

## Optional Features

The app works great without any database. But if you want:
- User accounts (OAuth login)
- Scan history
- API keys
- PDF reports
- Background queue processing

Then set up MongoDB + Redis and configure `.env` file.

See [SETUP.md](SETUP.md) for details.
