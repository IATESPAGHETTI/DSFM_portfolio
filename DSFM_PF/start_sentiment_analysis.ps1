# Quick Start - News Sentiment Analysis
# Run this script to set up and test the sentiment analysis feature

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host "  📰 INDmoney News Sentiment Analysis - Quick Start" -ForegroundColor White
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python
Write-Host "✓ Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Step 2: Install dependencies
Write-Host "`n✓ Installing required packages..." -ForegroundColor Yellow
Write-Host "  (This may take a few minutes on first run)" -ForegroundColor Gray
Set-Location indmoney-api
pip install transformers torch requests --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Packages installed successfully" -ForegroundColor Green
} else {
    Write-Host "  ❌ Failed to install packages" -ForegroundColor Red
    exit 1
}

# Step 3: Run initial NIFTY 50 analysis
Write-Host "`n✓ Running initial NIFTY 50 sentiment analysis..." -ForegroundColor Yellow
Write-Host "  (This will take 10-15 minutes - analyzing 50 stocks)" -ForegroundColor Gray
Write-Host "  ⏳ Please wait..." -ForegroundColor Gray
Write-Host ""

python app/tasks/update_sentiment.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n  ✅ Analysis complete! Results cached." -ForegroundColor Green
} else {
    Write-Host "`n  ⚠️  Analysis failed or was interrupted" -ForegroundColor Yellow
    Write-Host "     You can still use on-demand analysis (slower)" -ForegroundColor Gray
}

# Step 4: Start the backend
Write-Host "`n✓ Starting backend server..." -ForegroundColor Yellow
Write-Host "  Backend will run on: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API docs available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 2

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
}

Start-Sleep -Seconds 5

# Step 5: Start the frontend
Set-Location ..
Write-Host "`n✓ Starting frontend server..." -ForegroundColor Yellow
Write-Host "  Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "python serve.py"

Start-Sleep -Seconds 3

# Step 6: Open browser
Write-Host "`n✓ Opening browser..." -ForegroundColor Yellow
Start-Process chrome.exe "http://localhost:3000"

Write-Host "`n" -NoNewline
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 58) -ForegroundColor Green
Write-Host "  ✅ Setup Complete!" -ForegroundColor White
Write-Host "=" -NoNewline -ForegroundColor Green
Write-Host ("=" * 58) -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Navigate to INDstocks page" -ForegroundColor White
Write-Host "  2. Click the purple 'NEWS' button in the top bar" -ForegroundColor White
Write-Host "  3. View AI-powered sentiment analysis!" -ForegroundColor White

Write-Host "`n🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "  • Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host "  • API Docs: http://localhost:8000/docs" -ForegroundColor Gray

Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "  • First-time model load takes 30-60 seconds" -ForegroundColor Gray
Write-Host "  • Cached results are instant" -ForegroundColor Gray
Write-Host "  • Run update_sentiment.py hourly for fresh data" -ForegroundColor Gray

Write-Host "`n📖 For more info, see SENTIMENT_ANALYSIS_README.md" -ForegroundColor Cyan
Write-Host ""

# Keep script running
Write-Host "Press any key to stop servers and exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Stop-Job -Job $backendJob
Remove-Job -Job $backendJob
Write-Host "`n✅ Servers stopped. Goodbye!" -ForegroundColor Green
