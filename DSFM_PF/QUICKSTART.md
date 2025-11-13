# INDmoney Clone - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.11+ installed
- 8GB RAM minimum (for FinBERT model)
- Internet connection for API calls

### 1. Install Python Dependencies

```powershell
# Navigate to backend directory
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api

# Install all required packages
pip install -r requirements.txt
```

This installs:
- FastAPI (backend framework)
- SQLAlchemy (database ORM)
- scikit-learn (K-Means clustering)
- arch (GARCH volatility forecasting)
- transformers + torch (FinBERT sentiment analysis)
- And more...

### 2. Start the Backend Server

```powershell
# Make sure you're in the indmoney-api directory
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api

# Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

### 3. Start the Frontend Server

Open a **NEW** terminal window:

```powershell
# Navigate to project root
cd C:\Users\ASUS\Desktop\DSFM_PF

# Start the frontend server
python serve.py
```

You should see:
```
🚀 INDmoney Frontend Server
📡 Serving at: http://localhost:3000
```

### 4. Open the Application

Open your browser and go to:
```
http://localhost:3000
```

**Important**: Use `http://localhost:3000`, NOT `file:///` - WebSocket requires HTTP protocol!

### 5. Test the API

Open http://localhost:8000/docs to see the interactive API documentation (Swagger UI).

## 📋 API Endpoints Overview

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

#### Portfolio (`/portfolio`)
- `GET /portfolio` - Get user's holdings
- `POST /portfolio/trade` - Buy/sell assets

#### Assets (`/assets`)
- `GET /assets` - List all assets
- `GET /assets/{symbol}` - Get asset details
- `GET /assets/{symbol}/history` - Get historical OHLCV data

#### Analytics (`/api/v1/analytics`)
- `GET /api/v1/analytics/market-regime` - Current market regime (K-Means)
- `GET /api/v1/analytics/volatility-forecast?symbol=NIFTY_50` - 30-day volatility forecast (GARCH)

#### Sentiment (`/api/v1/sentiment`)
- `GET /api/v1/sentiment/stock/{symbol}` - News sentiment for a stock
- `GET /api/v1/sentiment/nifty50` - Sentiment for all NIFTY 50 stocks
- `GET /api/v1/sentiment/market-overview` - Market sentiment summary

#### WebSocket (`/ws`)
- `WS /ws/assets/{symbol}` - Real-time price updates

## 🎮 Using the Application

### Main Dashboard
1. View real-time market indices (NIFTY 50, SENSEX, BANK NIFTY)
2. Live price updates every 2 seconds
3. Click **INDstocks** to open trading interface

### Trading Interface (INDstocks)
1. Toggle between NIFTY 50 and SENSEX
2. Select stocks from dropdown
3. View interactive candlestick charts
4. Click **NEWS** button for sentiment analysis
5. Click **Analysis** for K-Means and GARCH forecasts

### News Sentiment Analysis
1. First click loads FinBERT model (10-20 seconds)
2. See market overview with overall sentiment
3. View top bullish/bearish stocks
4. Click **Refresh Analysis** to update data

## 📝 Example API Calls

### Register User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deepu@indmoney.com",
    "password": "test123",
    "full_name": "Deepu James"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deepu@indmoney.com",
    "password": "test123"
  }'
```

### Get Portfolio (with token)
```bash
curl http://localhost:8000/portfolio \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔧 Troubleshooting

### Backend won't start:
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed
Stop-Process -Id <PID> -Force

# Restart backend
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend won't start:
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
Stop-Process -Id <PID> -Force

# Restart frontend
cd C:\Users\ASUS\Desktop\DSFM_PF
python serve.py
```

### View server logs:
Just check the terminal windows where the servers are running!

### Stop all services:
Press `Ctrl+C` in each terminal window running the servers.

## 📚 Project Features

✅ **Completed:**
- Real-time market data streaming (2-second updates)
- Interactive trading charts (INDstocks)
- K-Means market regime detection
- GARCH(1,1) volatility forecasting
- FinBERT news sentiment analysis
- SQLite database
- REST API with FastAPI
- WebSocket for live updates
- Modern responsive UI

## 🎯 Tech Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, Uvicorn
- **Database**: SQLite (no setup required!)
- **ML**: scikit-learn (K-Means), arch (GARCH), FinBERT (sentiment)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Lightweight Charts v4.1.1, Chart.js
- **APIs**: Finnhub Stock API

Happy coding! 🚀
