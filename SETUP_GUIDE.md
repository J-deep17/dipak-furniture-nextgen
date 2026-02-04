# 🚀 Quick Start Guide - Environment Setup

## 📋 Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

---

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd steelshow-digital-main

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend Setup
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set:
# VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend Setup
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env and configure:
# - MONGO_URI (your MongoDB connection string)
# - RAZORPAY_KEY_ID (get from Razorpay dashboard)
# - RAZORPAY_KEY_SECRET (get from Razorpay dashboard)
```

### 3. Start Development Servers

```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Panel:** http://localhost:5173/admin/login

---

## 🔑 Required Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ Yes | Environment mode | `development` |
| `PORT` | ✅ Yes | Server port | `5000` |
| `MONGO_URI` | ✅ Yes | MongoDB connection | `mongodb://localhost:27017/steelshow` |
| `JWT_SECRET` | ✅ Yes | Authentication secret | Auto-generated (64 chars) |
| `GOOGLE_API_KEY` | ⚠️ Optional | AI features | Get from Google Cloud |
| `RAZORPAY_KEY_ID` | ⚠️ For Payments | Payment gateway | Get from Razorpay |
| `RAZORPAY_KEY_SECRET` | ⚠️ For Payments | Payment gateway | Get from Razorpay |
| `ORIGIN` | ✅ Yes | CORS origins | `http://localhost:5173` |

### Frontend (`.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | ✅ Yes | Backend API URL | `http://localhost:5000/api` |
| `VITE_SUPABASE_URL` | ⚠️ Optional | Supabase URL | Only if using Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ⚠️ Optional | Supabase key | Only if using Supabase |

---

## 🔐 Getting API Keys

### Razorpay (Payment Gateway)
1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Go to Settings → API Keys
3. Generate Test Keys for development
4. Copy Key ID and Key Secret to `server/.env`

### Google AI (Optional - for AI features)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Generative Language API"
4. Create credentials → API Key
5. Copy to `server/.env` as `GOOGLE_API_KEY`

### MongoDB Atlas (Production Database)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Replace `<password>` with your database password
5. Add to `server/.env` as `MONGO_URI`

---

## 🧪 Verify Setup

### Test Backend
```bash
cd server
npm run dev

# You should see:
# ✅ Server running on port 5000
# ✅ MongoDB Connected: localhost
```

### Test Frontend
```bash
npm run dev

# You should see:
# ✅ VITE ready in XXX ms
# ✅ Local: http://localhost:5173
```

### Test API Connection
```bash
# Open browser and visit:
http://localhost:5000/api/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

---

## 🚨 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:** 
- Check if MongoDB is running: `mongod --version`
- Verify `MONGO_URI` in `server/.env`
- For local MongoDB: `mongodb://localhost:27017/steelshow`

### Issue: "CORS error in browser"
**Solution:**
- Check `ORIGIN` in `server/.env` includes your frontend URL
- Default: `http://localhost:5173,http://localhost:8080`

### Issue: "Payment not working"
**Solution:**
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Uncomment payment routes in `server/server.js` (lines 50-51)
- Restart server after adding keys

### Issue: "AI features not working"
**Solution:**
- Add `GOOGLE_API_KEY` to `server/.env`
- Verify API is enabled in Google Cloud Console
- Check API quota limits

---

## 📁 Project Structure

```
steelshow-digital-main/
├── src/                    # Frontend React code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── lib/               # Utilities & API
├── server/                # Backend Node.js code
│   ├── controllers/       # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   └── uploads/          # Uploaded images
├── .env                  # Frontend environment (DO NOT COMMIT)
├── .env.example         # Frontend template
├── server/.env          # Backend environment (DO NOT COMMIT)
└── server/.env.example  # Backend template
```

---

## 🎯 Default Admin Credentials

After running the seed script:
- **Email:** `admin@steelshow.com`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change these credentials immediately in production!

---

## 📚 Next Steps

1. ✅ Review [TECHNICAL_AUDIT_REPORT.md](./TECHNICAL_AUDIT_REPORT.md)
2. ✅ Review [SECURITY_AUDIT.md](./SECURITY_AUDIT.md)
3. ✅ Configure payment gateway
4. ✅ Set up production database
5. ✅ Deploy to production

---

## 🆘 Need Help?

- **Documentation:** Check the `/docs` folder
- **API Reference:** Visit http://localhost:5000/api/health
- **Issues:** Check existing issues or create a new one

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong, unique passwords
- ✅ Rotate API keys regularly
- ✅ Enable 2FA on all accounts
- ✅ Keep dependencies updated

---

**Happy Coding! 🚀**
