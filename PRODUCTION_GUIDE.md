# 🚀 SteelShow Digital - Production Deployment Guide

This guide details the steps to deploy the SteelShow Digital application to production using **Vercel** (Frontend) and **Render/Railway/VPS** (Backend).

## 🛠 1. Pre-Deployment Checklist

- [x] **Production Build**: Verified locally using `npm run build`.
- [x] **Environment Variables**: Templates created in `.env.production` and `server/.env.production`.
- [x] **Production CORS**: Configured in `server.js` to support dynamic origins.
- [x] **Asset Optimization**: Vite build pipeline configured for minification and chunk splitting.
- [x] **Routing**: `vercel.json` added for SPA routing support.

---

## 📦 2. Environment Variables Configuration

You must set these variables in your deployment platform (Vercel/Render) dashboard.

### Frontend (Vercel Dashboard)
| Variable | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-api-domain.com/api` |
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_XXXXXXXXXXXXXX` |

### Backend (Render/Railway/VPS)
| Variable | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/steelshow` |
| `JWT_SECRET` | `A_LONG_RANDOM_SECURE_STRING` |
| `ORIGIN` | `https://your-website.com` |
| `SMTP_HOST` | `smtp.provider.com` |
| `SMTP_USER` | `your_email@provider.com` |
| `SMTP_PASS` | `your_app_password` |
| `RAZORPAY_KEY_ID` | `rzp_live_XXXXXXXXXXXXXX` |
| `RAZORPAY_KEY_SECRET` | `XXXXXXXXXXXXXX` |

---

## 🚀 3. Deployment Steps

### Frontend: Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Select the root directory.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Add the Frontend Environment Variables.
6. Deploy.

### Backend: Render
1. Connect your repository to [Render](https://render.com).
2. Create a "Web Service" and point it to the `server` directory.
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add the Backend Environment Variables.
4. Deploy.

---

## 🌐 4. Domain & SSL

1. **Vercel**: Go to Settings > Domains. Add your domain (e.g., `steelshow.com`). follow the A/CNAME record instructions. SSL is automatic.
2. **Backend**: If using Render, your API will have a subdomain (e.g., `api-steelshow.onrender.com`). You can also map a custom subdomain like `api.steelshow.com` in Render settings.
3. **DNS Configuration**:
   - `A` record for `@` pointing to Vercel IP.
   - `CNAME` for `www` pointing to Vercel.
   - `CNAME` for `api` pointing to your Backend URL.

---

## 🔁 5. Final Verification (Post-Deployment)

1. **Homepage**: Ensure banners load and transitions work.
2. **Products**: Check if categories and products are fetched from the live DB.
3. **Auth**: 
   - Sign up a new user.
   - Verify email (check if the link in email points to the correct production URL).
   - Login with Email and Phone OTP.
4. **Admin Panel**:
   - Access `/admin/login`.
   - Manage categories and products.
   - Upload a new banner image.
5. **WhatsApp Inquiry**: Add items to inquire and click "Send to WhatsApp".

---

## ⚠️ Important Note on File Uploads
Currently, images are stored in the `server/uploads` folder. **Render and Vercel have ephemeral filesystems**, meaning uploaded images will disappear after a restart/redeploy.

**Recommendation**: 
For a true production environment, update `server/routes/uploadRoutes.js` to use a cloud storage provider like **Cloudinary** or **AWS S3**.
