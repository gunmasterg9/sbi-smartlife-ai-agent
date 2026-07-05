# Start Next.js Frontend
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."

# Sync .env from root to .env.local
if (Test-Path "$ProjectRoot\.env") {
    Copy-Item "$ProjectRoot\.env" "$ProjectRoot\frontend\.env.local" -Force
}

cd "$ProjectRoot\frontend"
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Cyan
npm run dev
