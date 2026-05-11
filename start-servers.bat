@echo off
REM Start all development servers for NirmaanCloud

echo.
echo ====================================
echo Starting NirmaanCloud Servers
echo ====================================
echo.

REM Start NestJS API server in a new terminal
echo Starting NestJS API server on port 7001...
start cmd /k "cd /d D:\new er\apps\api && npm run dev"

REM Wait a moment for the first server to start
timeout /t 2 /nobreak

REM Start Next.js frontend server in a new terminal
echo Starting Next.js frontend server on port 3000...
start cmd /k "cd /d D:\new er && npm run dev"

echo.
echo ====================================
echo Servers started!
echo.
echo API:      http://127.0.0.1:7001/api/v1
echo Frontend: http://127.0.0.1:3000
echo.
echo ====================================
echo.
pause
