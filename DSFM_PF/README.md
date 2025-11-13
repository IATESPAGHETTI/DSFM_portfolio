# INDmoney Clone - Real-Time Market Intelligence Platform

## 🎯 Project Overview
A complete full-stack financial analysis platform inspired by INDmoney, featuring real-time market data, GARCH volatility forecasting, K-Means market regime detection, and professional trading interface for Indian stock markets (NIFTY 50, SENSEX).

## ✨ Features
- 📊 **Real-Time Data Streaming** - WebSocket updates every 2 seconds
- 🤖 **GARCH(1,1) Volatility Forecasting** - 30-day ahead predictions
- 📈 **K-Means Regime Detection** - Bull/Bear/High Volatility/Consolidation classification
- 🧠 **FinBERT Sentiment Analysis** - AI-powered news sentiment for stocks
- 💹 **Interactive Trading Charts** - Zoom, pan, crosshair with Lightweight Charts
- 🎨 **INDmoney-Style UI** - Clean, modern interface
- 🔄 **Live Price Updates** - Dashboard and trading interface sync
- 📰 **News Sentiment Modal** - Real-time market mood analysis with top movers

## 🏗️ Architecture
```
├── indmoney-api/              # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics.py   # K-Means & GARCH endpoints
│   │   │   ├── assets.py      # Asset & historical data
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── portfolio.py   # Portfolio management
│   │   │   ├── sentiment.py   # FinBERT news sentiment
│   │   │   └── websocket.py   # Real-time streaming
│   │   ├── core/
│   │   │   ├── config.py      # Configuration
│   │   │   ├── database.py    # SQLite connection
│   │   │   └── security.py    # JWT & hashing
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/
│   │       ├── finnhub_client.py      # Market data API
│   │       └── sentiment_analyzer.py  # FinBERT analyzer
│   └── requirements.txt
│
├── Frontend Files (HTML/CSS/JS)
│   ├── index.html             # Main application
│   ├── styles.css             # Complete styling
│   ├── script.js              # WebSocket & charts
│   └── serve.py               # HTTP server
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** installed
- **8GB RAM minimum** (for FinBERT model)
- **Internet connection** for API calls and model download
- **Windows PowerShell** or any terminal

### Quick Installation (2 Minutes)

#### Step 1: Install Python Dependencies
```powershell
# Navigate to backend directory
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api

# Install all required packages
pip install -r requirements.txt
```

**Packages installed:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - Database ORM
- `scikit-learn` - K-Means clustering
- `arch` - GARCH forecasting
- `transformers` - FinBERT model
- `torch` - PyTorch for ML
- `requests` - HTTP client for APIs
- And more...

##### Step 2: Start Backend Server
```powershell
# Run from indmoney-api directory
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**What you'll see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

Backend is now running on **port 8000** with SQLite database!

##### Step 3: Start Frontend Server
```powershell
# Open a NEW terminal window
cd C:\Users\ASUS\Desktop\DSFM_PF
python serve.py
```

**What you'll see:**
```
🚀 INDmoney Frontend Server
📡 Serving at: http://localhost:3000
📂 Directory: C:\Users\ASUS\Desktop\DSFM_PF
✨ Open http://localhost:3000 in your browser
```

Frontend is now running on **port 3000**!

#### Step 4: Open Application
Open your browser and navigate to:
```
http://localhost:3000
```

**⚠️ IMPORTANT**: You MUST use `http://localhost:3000`, NOT `file:///` to open `index.html`. WebSocket connections require HTTP protocol.

### 🎉 You're Ready!
- Main dashboard: http://localhost:3000
- API documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health

**First time using NEWS sentiment?** The FinBERT model (438MB) will download on first click. This takes 10-20 seconds, then it's instant!

---

## 📋 Available Endpoints

### Backend API (http://localhost:8000)

#### Analytics
- `GET /api/v1/analytics/market-regime?symbol=NIFTY_50` - K-Means classification
- `GET /api/v1/analytics/volatility-forecast?symbol=NIFTY_50` - GARCH forecast

#### Sentiment Analysis
- `GET /api/v1/sentiment/stock/{symbol}` - Get sentiment for specific stock
- `GET /api/v1/sentiment/nifty50` - Sentiment analysis for all NIFTY 50 stocks
- `GET /api/v1/sentiment/market-overview` - Market sentiment summary with top movers
- `POST /api/v1/sentiment/refresh-nifty50` - Trigger background refresh of all stocks

#### Assets
- `GET /assets` - List all assets
- `GET /assets/{symbol}` - Get asset details
- `GET /assets/{symbol}/history` - Historical OHLCV data

#### WebSocket
- `ws://localhost:8000/ws/assets/NIFTY_50` - Real-time NIFTY 50 updates
- `ws://localhost:8000/ws/assets/SENSEX` - Real-time SENSEX updates

#### Health
- `GET /health` - System health check
- `GET /docs` - Interactive API documentation (Swagger UI)

## 🎮 Using the Application

### Dashboard View
- Real-time market indices (NIFTY 50, SENSEX, BANK NIFTY)
- Live price updates with green/red pulse animations
- Market overview cards

### INDstocks Trading Interface
- Interactive candlestick charts
- Zoom: Use mousewheel
- Pan: Click and drag
- Hover: See OHLC tooltip
- 30-day historical data
- Toggle between NIFTY 50 and SENSEX
- Stock selector with filtered stock lists
- **NEWS Button**: View AI-powered sentiment analysis

### News Sentiment Analysis
- Click **NEWS** button in trading interface
- View market overview with overall sentiment score
- See sentiment breakdown (positive/negative/neutral)
- Top bullish and bearish stocks
- Individual stock sentiment with confidence scores
- Powered by FinBERT (ProsusAI) and Finnhub news API
- First load takes 10-20 seconds (model loading), then instant

### Analysis Dashboard
- **K-Means Market Regime**: Bar chart showing 6 features (Vol, Returns, Momentum, Trend, RSI, Volume)
- **GARCH Volatility Forecast**: 30-day line chart with mean indicator
- **AI Insights**: Market sentiment and risk recommendations
- **Market Selector**: Switch between NIFTY 50 and SENSEX

## 🔧 Troubleshooting

### WebSocket Not Connecting
**Problem**: Dashboard says "Connecting..." but never updates

**Solution**:
1. Ensure you're accessing via `http://localhost:3000` (NOT `file:///`)
2. Check backend is running on port 8000
3. Check terminal logs for errors
4. Restart backend server

### Analytics Showing Errors
**Problem**: Analysis dashboard shows "Failed to load"

**Solution**:
1. Restart backend server
2. Test endpoint directly:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8000/api/v1/analytics/market-regime?symbol=NIFTY_50"
   ```

### Ports Already in Use
**Problem**: "Address already in use" error when starting servers

**Solution**:
1. For backend (port 8000):
   ```powershell
   netstat -ano | findstr :8000
   Stop-Process -Id <PID> -Force
   ```
2. For frontend (port 3000):
   ```powershell
   netstat -ano | findstr :3000
   Stop-Process -Id <PID> -Force
   ```

### FinBERT Model Loading Slow
**Problem**: First time clicking NEWS button takes 10-20 seconds

**Solution**: This is normal! The FinBERT model (438MB) loads on first request. Subsequent requests will be instant. The model downloads once and is cached locally.

### Sentiment Analysis Not Working
**Problem**: NEWS button shows error or doesn't load

**Solution**:
1. Ensure backend server is running
2. Check internet connection (needs to fetch news from Finnhub)
3. First load requires downloading 438MB model (be patient)
4. Check terminal for FinBERT loading logs

## 📊 Example API Calls

### Get Market Regime (K-Means)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/analytics/market-regime?symbol=NIFTY_50" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected output:
```json
{
  "regime_name": "Bull Market",
  "features": {
    "volatility": 18.5,
    "returns": 5.2,
    "momentum": 0.8,
    "trend": 0.5,
    "rsi": 58.5,
    "volume": 150000000.0
  },
  "description": "Strong upward trend...",
  "symbol": "NIFTY_50"
}
```

### Get Volatility Forecast (GARCH)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/analytics/volatility-forecast?symbol=NIFTY_50" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected output:
```json
{
  "symbol": "NIFTY_50",
  "forecast": [1.447, 1.447, ...],
  "mean_volatility": 1.447,
  "model": "GARCH(1,1)"
}
```

### Get News Sentiment (Market Overview)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/sentiment/market-overview" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected output:
```json
{
  "overall_sentiment": "bullish",
  "market_mood": "Positive",
  "sentiment_score": 0.65,
  "breakdown": {
    "positive": 32,
    "negative": 8,
    "neutral": 10
  },
  "top_bullish": [
    {"symbol": "RELIANCE", "sentiment": "positive", "score": 0.89},
    {"symbol": "TCS", "sentiment": "positive", "score": 0.85}
  ],
  "top_bearish": [
    {"symbol": "HDFC", "sentiment": "negative", "score": -0.45}
  ]
}
```

### Get Stock Sentiment
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/sentiment/stock/RELIANCE" -UseBasicParsing | Select-Object -ExpandProperty Content
```

## 🔄 Development

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### Restart Services
```powershell
# Restart backend server
# Press Ctrl+C in the terminal running uvicorn, then restart it
cd C:\Users\ASUS\Desktop\DSFM_PF\indmoney-api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Stop Services
```powershell
# Press Ctrl+C in each terminal window running the servers
```

## 💾 Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Frontend** | HTML5, CSS3, JavaScript | ES6+ | User interface |
| **Charting** | Lightweight Charts | 4.1.1 | Trading charts |
| **Analytics Charts** | Chart.js | 4.4.0 | ML visualizations |
| **Backend** | FastAPI | Latest | REST API |
| **Server** | Uvicorn | Latest | ASGI server |
| **Language** | Python | 3.12 | Core logic |
| **Database** | SQLite | Built-in | Persistence |
| **ML - Clustering** | scikit-learn | 1.3.2 | K-Means |
| **ML - Forecasting** | arch | 6.2.0 | GARCH |
| **ML - Sentiment** | FinBERT + PyTorch | Latest | News sentiment |
| **NLP Model** | ProsusAI/finbert | Pre-trained | Financial sentiment |
| **Transformers** | Hugging Face | 4.50.3 | Model loading |
| **Data Processing** | numpy, pandas | Latest | Numerical ops |
| **Market Data** | Finnhub API | v1 | Live quotes & news |

## 🎯 Project Status

✅ **COMPLETED FEATURES**
- Full-stack architecture with Python (No Docker required!)
- GARCH(1,1) volatility forecasting (30-day predictions)
- K-Means market regime detection (4 clusters: Bull/Bear/High Vol/Consolidation)
- **FinBERT sentiment analysis** (ProsusAI model)
- **News sentiment modal** with market overview
- Real-time WebSocket streaming (2-second updates)
- Interactive trading charts (Lightweight Charts)
- Analysis dashboard with ML insights
- INDmoney-style responsive UI
- SQLite database (zero configuration)
- Stock filtering by NIFTY 50 / SENSEX
- Consistent analytics (deterministic results)
- Finnhub API integration for news

🔮 **FUTURE ENHANCEMENTS**
- LLM-powered market commentary (GPT integration)
- User authentication & portfolio tracking
- More stocks (expand beyond NIFTY/SENSEX)
- Backtesting engine for strategies
- Mobile app (React Native)
- NSE/BSE official data integration
- Real-time alerts and notifications
- Technical indicators (MACD, Bollinger Bands, etc.)

## 🔑 API Keys

This project uses **Finnhub API** for market data and news:
- Free tier: 60 calls/minute
- Sign up: https://finnhub.io/register
- Current API key configured in `sentiment_analyzer.py`

## 📞 Support

### For Issues
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [QUICKSTART.md](QUICKSTART.md)
3. Review API docs at http://localhost:8000/docs

### Project Structure
- `indmoney-api/` - Complete backend code with FastAPI
  - `app/api/` - REST API endpoints (analytics, sentiment, assets, websocket)
  - `app/services/` - Business logic (FinBERT analyzer, Finnhub client)
  - `app/models/` - SQLAlchemy database models
  - `app/core/` - Configuration and database setup
- `index.html` - Frontend application (single-page app)
- `script.js` - Client-side logic (3185 lines with sentiment analysis)
- `styles.css` - UI styling (3290 lines with modal styles)
- `serve.py` - Simple HTTP server for frontend

## 🎓 Learning Resources
- FastAPI: https://fastapi.tiangolo.com
- Lightweight Charts: https://tradingview.github.io/lightweight-charts/
- GARCH Models: https://arch.readthedocs.io/
- K-Means Clustering: https://scikit-learn.org/stable/modules/clustering.html
- WebSocket Protocol: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- FinBERT Model: https://huggingface.co/ProsusAI/finbert
- Transformers Library: https://huggingface.co/docs/transformers/
- Finnhub API: https://finnhub.io/docs/api

## 📁 Key Files

### Backend
- `indmoney-api/app/services/sentiment_analyzer.py` - FinBERT implementation (340 lines)
- `indmoney-api/app/api/sentiment.py` - Sentiment API endpoints (213 lines)
- `indmoney-api/app/api/analytics.py` - K-Means & GARCH endpoints
- `indmoney-api/app/main.py` - FastAPI application entry point

### Frontend
- `script.js` - Complete app logic with sentiment module (lines 2979-3185)
- `index.html` - News sentiment modal (lines 600-695)
- `styles.css` - Modal styling (lines 2889-3290)

---

**Status**: ✅ Fully functional with AI-powered sentiment analysis
**Last Updated**: November 13, 2025
**Version**: 2.0 (Added FinBERT Sentiment Analysis)
**Team**: Deepu James, Yaksh Rohilla, Mukund Madhav Agarwal, Aarav Pratap Singh
