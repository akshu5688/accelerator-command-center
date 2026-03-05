# Push to tech637 GitHub account
# Run this script in PowerShell

Write-Host "=== Push to tech637 GitHub ===" -ForegroundColor Cyan

# Check if gh is available
$ghPath = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghPath) {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Step 1: Authenticate with tech637
Write-Host "`n1. Authenticating with GitHub..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in. A browser will open - sign in with your tech637 account." -ForegroundColor Yellow
    gh auth login -h github.com -p https -w
}

# Step 2: Create repo and push
Write-Host "`n2. Creating repository and pushing..." -ForegroundColor Yellow
gh repo create tech637/accelerator-command-center --public --source=. --remote=tech637 --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccess! Code pushed to https://github.com/tech637/accelerator-command-center" -ForegroundColor Green
} else {
    Write-Host "`nIf repo already exists, run: git push tech637 main" -ForegroundColor Yellow
}
