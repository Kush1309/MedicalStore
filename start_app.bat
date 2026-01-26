@echo off
echo ===================================================
echo   Starting Medicare Medical Store Application
echo ===================================================
echo.

cd /d "%~dp0"

IF NOT EXIST "backend\node_modules" (
    echo [Setup] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo [Setup] Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Launching application...
node start.js

echo.
pause
