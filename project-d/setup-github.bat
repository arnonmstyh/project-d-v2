@echo off
echo ========================================
echo Multi-Vendor Firewall Converter Setup
echo AIT Cybersecurity Team
echo ========================================
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git first:
    echo 1. Go to https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this command prompt
    echo 4. Run this script again
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...
echo.

echo Initializing Git repository...
git init

echo.
echo Adding all files to Git...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Multi-Vendor Firewall Converter with AIT branding"

echo.
echo Adding GitHub remote repository...
git remote add origin https://github.com/arnonmstyh/multi-vendor-firewall-converter.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your repository is now available at:
echo https://github.com/arnonmstyh/multi-vendor-firewall-converter
echo.
echo You can now:
echo 1. View your repository on GitHub
echo 2. Clone it on other machines
echo 3. Collaborate with team members
echo.
pause
