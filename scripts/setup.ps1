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

# Create .env at project root from .env.example if it doesn't exist
$RootEnv = "$ProjectRoot\.env"
$RootEnvExample = "$ProjectRoot\.env.example"

if (-not (Test-Path $RootEnv)) {
    if (Test-Path $RootEnvExample) {
        Write-Host "Creating root .env configuration file..." -ForegroundColor Gray
        Copy-Item $RootEnvExample $RootEnv
    } else {
        Write-Host "Warning: .env.example not found in project root!" -ForegroundColor Yellow
    }
}

# Prompt user for API Key
if (Test-Path $RootEnv) {
    Write-Host "`nWould you like to configure your Gemini API Key to enable live AI features? [Y/N] (Default: N)" -ForegroundColor Cyan
    $choice = Read-Host
    if ($choice -match '^[Yy]$') {
        $apiKey = Read-Host "Enter your GEMINI_API_KEY"
        if ($apiKey) {
            # Update root .env with live mode and API key
            $envContent = Get-Content $RootEnv
            $envContent = $envContent -replace 'AI_MODE=simulated', 'AI_MODE=live'
            $envContent = $envContent -replace 'GEMINI_API_KEY=.*', "GEMINI_API_KEY=$apiKey"
            $envContent | Set-Content $RootEnv
            Write-Host "Root .env updated with live AI mode and your API key." -ForegroundColor Green
        }
    }
}

# Sync root .env to backend and frontend
Write-Host "Syncing .env file to backend and frontend..." -ForegroundColor Gray
if (Test-Path $RootEnv) {
    Copy-Item $RootEnv "$ProjectRoot\backend\.env" -Force
    Copy-Item $RootEnv "$ProjectRoot\frontend\.env.local" -Force
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
