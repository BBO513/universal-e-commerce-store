# E-Commerce Application Setup Script for Windows
# Run this script to set up your development environment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "E-Commerce App Setup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "[✓] .env.local already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y") {
        Write-Host "Skipping .env.local creation" -ForegroundColor Yellow
    } else {
        Copy-Item .env.local.example .env.local
        Write-Host "[✓] Created .env.local from example" -ForegroundColor Green
    }
} else {
    Copy-Item .env.local.example .env.local
    Write-Host "[✓] Created .env.local from example" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit .env.local and fill in your environment variables" -ForegroundColor Yellow
Write-Host "   - Generate NEXTAUTH_SECRET: openssl rand -base64 32" -ForegroundColor Gray
Write-Host "   - Add your DATABASE_URL" -ForegroundColor Gray
Write-Host "   - Add Stripe keys (test mode)" -ForegroundColor Gray
Write-Host "   - Add email configuration" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setup PostgreSQL database:" -ForegroundColor Yellow
Write-Host "   psql -U postgres -c 'CREATE DATABASE auto_parts_store;'" -ForegroundColor Gray
Write-Host "   psql -U postgres -d auto_parts_store -f schema.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Install dependencies:" -ForegroundColor Yellow
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run development server:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Open TESTING_GUIDE.md for complete testing procedures" -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "[✓] Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[✗] Node.js not found. Please install Node.js first." -ForegroundColor Red
}

# Check if PostgreSQL is installed
$pgVersion = psql --version 2>$null
if ($pgVersion) {
    Write-Host "[✓] PostgreSQL installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "[!] PostgreSQL not found. You'll need to install it." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup script completed!" -ForegroundColor Green
Write-Host ""
