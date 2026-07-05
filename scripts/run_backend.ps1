# Start Backend API Server
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."

# Sync .env from root
if (Test-Path "$ProjectRoot\.env") {
    Copy-Item "$ProjectRoot\.env" "$ProjectRoot\backend\.env" -Force
}

cd "$ProjectRoot\backend"
Write-Host "Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Cyan
& .venv\Scripts\uvicorn app.main:app --reload --port 8000
