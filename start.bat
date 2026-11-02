@echo off
echo ========================================================
echo Starting AI Road Damage Detection System
echo ========================================================

echo 1. Starting Backend API server (FastAPI)...
start "Backend - FastAPI" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo 2. Starting Frontend server (Next.js)...
start "Frontend - Next.js" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting up!
echo - Backend:  http://localhost:8000/docs
echo - Frontend: http://localhost:3000
echo.
echo Opening http://localhost:3000 in your browser in 4 seconds...
timeout /t 4 /nobreak >nul
start http://localhost:3000
