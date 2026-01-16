@echo off
REM Setup script for Ali Optical POS Inventory System deployment

echo ============================================
echo Ali Optical POS - Deployment Setup
echo ============================================
echo.

REM Check if .env files exist
if not exist "server\.env" (
    echo Creating server\.env from template...
    copy server\.env.example server\.env
    echo [MANUAL ACTION] Please edit server\.env with your production values
) else (
    echo server\.env already exists
)

if not exist "my-app\.env.local" (
    echo Creating my-app\.env.local from template...
    copy my-app\.env.local.example my-app\.env.local
    echo [MANUAL ACTION] Please edit my-app\.env.local if needed
) else (
    echo my-app\.env.local already exists
)

echo.
echo ============================================
echo Checking Node.js installation...
echo ============================================
node --version
npm --version

echo.
echo ============================================
echo Installing backend dependencies...
echo ============================================
cd server
call npm install
cd ..

echo.
echo ============================================
echo Installing frontend dependencies...
echo ============================================
cd my-app
call pnpm install
cd ..

echo.
echo ============================================
echo Build Summary
echo ============================================
echo.
echo To build for production:
echo   Backend: No build needed (Node.js runs directly)
echo   Frontend: cd my-app && pnpm build
echo.
echo To start in development:
echo   Backend: cd server && npm run dev
echo   Frontend: cd my-app && pnpm dev
echo.
echo To start in production:
echo   Backend: cd server && npm start
echo   Frontend: cd my-app && pnpm start
echo.
echo Review DEPLOYMENT.md for full deployment instructions.
echo ============================================

pause
