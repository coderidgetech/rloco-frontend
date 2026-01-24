@echo off
REM Rloco - Clear Cache Script (Windows)
REM This script clears all development caches to resolve browser caching issues

echo =============================
echo Rloco Cache Cleaner (Windows)
echo =============================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo [INFO] Starting cache cleanup...
echo.

REM Step 1: Clear Vite cache
echo [INFO] Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo [SUCCESS] Vite cache cleared
) else (
    echo [WARNING] Vite cache not found (already clean)
)

REM Step 2: Clear dist folder
echo [INFO] Clearing dist folder...
if exist "dist" (
    rmdir /s /q "dist"
    echo [SUCCESS] Dist folder cleared
) else (
    echo [WARNING] Dist folder not found (already clean)
)

REM Step 3: Clear general cache
echo [INFO] Clearing general cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo [SUCCESS] General cache cleared
) else (
    echo [WARNING] General cache not found (already clean)
)

REM Step 4: Clear TypeScript cache
echo [INFO] Clearing TypeScript cache...
if exist "tsconfig.tsbuildinfo" (
    del /f /q "tsconfig.tsbuildinfo"
    echo [SUCCESS] TypeScript cache cleared
) else (
    echo [WARNING] TypeScript cache not found (already clean)
)

echo.
echo [SUCCESS] All caches cleared successfully!
echo.

REM Provide next steps
echo ========================================
echo Next Steps:
echo ========================================
echo   1. Restart your development server (if running)
echo   2. Hard refresh your browser:
echo      - Windows: Ctrl + Shift + R or Ctrl + F5
echo   3. If issues persist, try:
echo      - Opening DevTools and disabling cache
echo      - Using incognito/private browsing mode
echo.

REM Optional: Offer to start dev server
set /p START_SERVER="Would you like to start the development server now? (Y/N): "
if /i "%START_SERVER%"=="Y" (
    echo [INFO] Starting development server...
    npm run dev
)

pause
