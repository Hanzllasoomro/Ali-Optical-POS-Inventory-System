@echo off

:: ===== Check for Admin Privileges =====
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: ===== Move to Project Root (current file location) =====
cd "C:\Users\Hanzlla Soomro\Projects\web\Ali Optical POS Inventory System
"

echo ======================================
echo Running Ali Optical POS System (ADMIN)
echo ======================================

:: ===== Start Backend =====
echo Starting Backend...
start "Backend Server" cmd /k "cd server && npm run dev"

:: ===== Start Frontend =====
echo Starting Frontend...
start "Frontend App" cmd /k "cd my-app && npm run dev"

echo ======================================
echo All services started successfully
echo ======================================
