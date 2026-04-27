# EHP - Emergency Health Passport

EHP is a comprehensive Health Passport application designed to provide quick access to vital medical information and emergency contacts during critical situations. It features a secure backend, a dynamic frontend, and QR code integration for instant access to patient data.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Cookie-parser
- **Tools**: QR Code generation, Axios

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd ehp-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file based on `.env.example`.
- Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file based on `.env.example`.
- Start the development server:
```bash
npm run dev
```

---

## 🌐 Deployment Instructions

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your Connection String.
3. Whitelist `0.0.0.0/0` (or your server's IP) in Network Access.

### 2. Backend Deployment (Render / Heroku / DigitalOcean)
1. **Push to GitHub**: Ensure your code is in a repository.
2. **Create Web Service**: Connect your repo to Render or your preferred host.
3. **Set Environment Variables**:
   - `PORT`: 10000 (or the default provided by the host)
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long, secure random string.
   - `CORS_ORIGIN`: Your production frontend URL (e.g., `https://ehp-app.vercel.app`).
   - `FRONTEND_URL`: Your production frontend URL.
   - `NODE_ENV`: `production`
4. **Build & Start**:
   - Build Command: `npm install && npx tsc`
   - Start Command: `node dist/index.js` (Ensure your `package.json` scripts are updated).

### 3. Frontend Deployment (Vercel / Netlify)
1. **Connect Repo**: Connect the `frontend` directory to Vercel or Netlify.
2. **Set Environment Variables**:
   - `VITE_API_URL`: Your production backend API URL (e.g., `https://ehp-backend.onrender.com/api`).
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Framework Preset**: Vite (if not auto-detected).

---

## 🔒 Security Note
- Never commit your `.env` files.
- Ensure `JWT_SECRET` is unique and strong in production.
- Use HTTPS for all production communication.

## 📄 License
This project is licensed under the ISC License.
