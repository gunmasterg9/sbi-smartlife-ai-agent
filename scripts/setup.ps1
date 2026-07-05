# SBI SmartLife Setup Script for Windows (Local SQLite & Node.js)
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   SBI SmartLife AI Agent Platform - Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."

# 1. Setup Backend
Write-Host "`n[1/3] Setting up Python backend (SQLite mode)..." -ForegroundColor Yellow
cd "$ProjectRoot\backend"

if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv .venv
}

Write-Host "Activating virtual environment and installing dependencies..." -ForegroundColor Gray
& .venv\Scripts\pip install -r requirements.txt

# Create .env from .env.example if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env configuration file..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
}

# Run Database Migrations and Seed data on SQLite
Write-Host "Initializing SQLite database and generating 500 customer records..." -ForegroundColor Gray
& .venv\Scripts\python -m seeds.seed_data --db-url sqlite:///./sbi_smartlife.db

# 2. Setup Frontend
Write-Host "`n[2/3] Setting up Next.js frontend..." -ForegroundColor Yellow
cd "$ProjectRoot\frontend"

Write-Host "Installing npm packages (this may take a minute)..." -ForegroundColor Gray
npm install

# 3. Complete Setup
Write-Host "`n[3/3] Setup Completed Successfully!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "To run the platform locally:" -ForegroundColor Cyan
Write-Host "  1. Start Backend: Run 'scripts\run_backend.ps1' or run 'cd backend; .venv\Scripts\uvicorn app.main:app --reload'" -ForegroundColor Gray
Write-Host "  2. Start Frontend: Run 'scripts\run_frontend.ps1' or run 'cd frontend; npm run dev'" -ForegroundColor Gray
Write-Host "===============================================" -ForegroundColor Green
