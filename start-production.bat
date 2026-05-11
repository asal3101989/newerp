@echo off
:: BCIM ERP - Start all production services
:: Run this script after a reboot or to restart all services
:: Right-click -> "Run as administrator" if pm2 doesn't start

echo Starting BCIM ERP production services...
cd /d "D:\new er"
pm2 resurrect
echo.
echo Services started. Check status with: pm2 status
echo Logs: pm2 logs
pause
