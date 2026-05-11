@echo off
REM Start all development servers for NirmaanCloud

cd /d "D:\new er"

echo.
echo ====================================
echo Starting NirmaanCloud Servers
echo ====================================
echo.

REM Start NestJS API server
echo Starting NestJS API on port 7001...
start "NirmaanCloud API" cmd /k "cd apps\api && npm run dev"

REM Wait for API to start
timeout /t 3 /nobreak

REM Start Next.js frontend
echo Starting Next.js frontend on port 7000...
start "NirmaanCloud Frontend" cmd /k "npm run dev"

echo.
echo ====================================
echo Both servers starting...
echo API:      http://127.0.0.1:7001/api/v1/health
echo Frontend: http://127.0.0.1:7000
echo ====================================
echo.
echo Close individual windows to stop each server
echo.
pause
