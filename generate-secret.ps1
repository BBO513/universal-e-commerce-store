# Generate NEXTAUTH_SECRET for .env.local
# This script generates a secure random secret for NextAuth.js

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "NEXTAUTH_SECRET Generator" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if OpenSSL is available
$opensslAvailable = Get-Command openssl -ErrorAction SilentlyContinue

if ($opensslAvailable) {
    Write-Host "Generating secret using OpenSSL..." -ForegroundColor Yellow
    $secret = openssl rand -base64 32
    Write-Host ""
    Write-Host "Your NEXTAUTH_SECRET:" -ForegroundColor Green
    Write-Host $secret -ForegroundColor White
    Write-Host ""
    Write-Host "Add this to your .env.local file:" -ForegroundColor Yellow
    Write-Host "NEXTAUTH_SECRET=$secret" -ForegroundColor Gray
} else {
    Write-Host "OpenSSL not found. Generating secret using PowerShell..." -ForegroundColor Yellow
    
    # Generate random bytes and convert to base64
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    
    Write-Host ""
    Write-Host "Your NEXTAUTH_SECRET:" -ForegroundColor Green
    Write-Host $secret -ForegroundColor White
    Write-Host ""
    Write-Host "Add this to your .env.local file:" -ForegroundColor Yellow
    Write-Host "NEXTAUTH_SECRET=$secret" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

# Offer to add to .env.local automatically
if (Test-Path .env.local) {
    Write-Host ""
    $update = Read-Host "Do you want to update .env.local automatically? (y/N)"
    if ($update -eq "y") {
        $content = Get-Content .env.local -Raw
        if ($content -match "NEXTAUTH_SECRET=") {
            $content = $content -replace "NEXTAUTH_SECRET=.*", "NEXTAUTH_SECRET=$secret"
            Set-Content .env.local $content
            Write-Host "[✓] Updated NEXTAUTH_SECRET in .env.local" -ForegroundColor Green
        } else {
            Add-Content .env.local "`nNEXTAUTH_SECRET=$secret"
            Write-Host "[✓] Added NEXTAUTH_SECRET to .env.local" -ForegroundColor Green
        }
    }
} else {
    Write-Host ""
    Write-Host "[!] .env.local not found. Run setup.ps1 first." -ForegroundColor Yellow
}

Write-Host ""
