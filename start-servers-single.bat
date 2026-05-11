@echo off
REM Start all development servers in a single terminal (sequential mode)
REM Note: This will start the API first, then the frontend when API is ready

cd /d D:\new er

echo.
echo ====================================
echo Starting NirmaanCloud Servers
echo ====================================
echo.

echo Starting NestJS API server on port 7001...
echo (Keep this terminal open - API will run here)
echo.

REM Start NestJS API - this will block until Ctrl+C
cd apps\api
npm run dev
