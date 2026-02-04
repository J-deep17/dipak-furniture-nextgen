# Admin System Setup Instructions

This project now includes a complete Node.js + Express + MongoDB backend and a React Admin Dashboard.

## 1. Backend Setup

The backend code is located in the `server/` directory.

### Prerequisites
- Node.js installed
- MongoDB installed and running (default: `mongodb://localhost:27017/steelshow`)

### Installation
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```

2. Seed the database with an Admin User:
   ```bash
   npm run seed
   ```
   This will create a Super Admin:
   - **Email:** `admin@steelshow.com`
   - **Password:** `password123`

3. Start the Backend Server:
   ```bash
   npm run dev
   ```
   The API will run on `http://localhost:5000`.

## 2. Frontend Setup

The frontend connects to the backend at `http://localhost:5000`.

1. Ensure the backend is running.
2. In a separate terminal, run the frontend:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:8080/admin/login` (or whatever port Vite is running on).
4. Login with the credentials above.

## Features Implemented

- **Authentication**: JWT Login, Protected Routes.
- **Dashboard**: Stats for Products, Categories, Enquiries.
- **Product Management**:
  - List, Add, Edit, Delete.
  - Image Upload (Stored locally in `server/uploads`).
  - Rich fields (Features, Dimensions, SEO).
- **Category Management**: Create, Edit, Delete.
- **Enquiry Management**: View enquiries, update status (New, Read, Contacted).

## Deployment Notes

- **Environment Variables**:
  - Check `server/.env` for configuration.
  - Set `MONGO_URI` to your production MongoDB.
  - Set `JWT_SECRET` to a strong secret.
- **Images**:
  - Currently images are stored in `server/uploads`. For production, update `server/routes/uploadRoutes.js` to use Cloudinary or S3.
