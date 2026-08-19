@echo off
echo ========================================================
echo   EHP - Emergency Health Profile Native Mobile App
echo   React Native + Expo SDK 51
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node modules...
if not exist node_modules (
    echo Installing required packages...
    npm install
) else (
    echo Packages already installed.
)

echo.
echo [2/3] Starting Expo Metro Bundler...
echo.
echo Scan the QR code with the Expo Go app on your phone!
echo.

npx expo start

pause
