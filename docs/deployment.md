# Deployment Guide: Vercel & Python Cloud

This guide outlines steps for deploying the frontend to **Vercel** and the backend to Python-compatible cloud hosts (e.g., Render, Railway, AWS EC2, Hugging Face Spaces).

---

## 1. Frontend Deployment (Vercel)

### Step 1: Push Repository to GitHub
Ensure all code (excluding `.env`, `node_modules`, `venv`, and binary weights) is pushed to your GitHub repository.

### Step 2: Import Project in Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository (`AI-CSA1707` or `road-damage-ai`).
4. Configure the build settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Configure Environment Variables
In the Vercel Project Settings under **Environment Variables**, add:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-domain.com
```

### Step 4: Deploy
Click **Deploy**. Vercel will build and host the responsive Next.js frontend globally on edge CDN.

---

## 2. Backend Deployment (Render / Railway / AWS / HF Spaces)

### Option A: Render / Railway Deployment
1. Create a new **Web Service** pointing to the GitHub repository.
2. Set Root Directory: `backend`
3. Environment: `Python 3.11`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Set Environment Variables:
   ```env
   MODEL_PATH=models/best.pt
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
   DEVICE=cpu
   ```

### Option B: Local Production Server
Run uvicorn in production mode:
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```
