# Multi-Vendor Firewall Converter - GitHub Setup Script
# AIT Cybersecurity Team

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Multi-Vendor Firewall Converter Setup" -ForegroundColor Cyan
Write-Host "AIT Cybersecurity Team" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "1. Go to https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Download and install Git" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Multi-Vendor Firewall Converter with AIT branding"

Write-Host ""
Write-Host "Adding GitHub remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/arnonmstyh/multi-vendor-firewall-converter.git

Write-Host ""
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now available at:" -ForegroundColor Cyan
Write-Host "https://github.com/arnonmstyh/multi-vendor-firewall-converter" -ForegroundColor Blue
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. View your repository on GitHub" -ForegroundColor White
Write-Host "2. Clone it on other machines" -ForegroundColor White
Write-Host "3. Collaborate with team members" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
