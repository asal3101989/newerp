@echo off
REM Stop all Node.js servers

echo.
echo ====================================
echo Stopping NirmaanCloud Servers
echo ====================================
echo.

taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js processes stopped
) else (
    echo [INFO] No Node.js processes running
)

taskkill /F /IM npm.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm processes stopped
) else (
    echo [INFO] No npm processes running
)

echo.
echo ====================================
echo All servers stopped!
echo ====================================
echo.
pause
