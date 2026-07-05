# Start Next.js Frontend
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."

cd "$ProjectRoot\frontend"
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Cyan
npm run dev
