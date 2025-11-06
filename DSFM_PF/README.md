# INDmoney Clone - Real-Time Market Intelligence Platform

## 🎯 Project Overview
A complete full-stack financial analysis platform inspired by INDmoney, featuring real-time market data, GARCH volatility forecasting, K-Means market regime detection, and professional trading interface for Indian stock markets (NIFTY 50, SENSEX).

## ✨ Features
- 📊 **Real-Time Data Streaming** - WebSocket updates every 2 seconds
- 🤖 **GARCH(1,1) Volatility Forecasting** - 30-day ahead predictions
- 📈 **K-Means Regime Detection** - Bull/Bear/High Volatility/Consolidation classification
- 💹 **Interactive Trading Charts** - Zoom, pan, crosshair with Lightweight Charts
- 🎨 **INDmoney-Style UI** - Clean, modern interface
- 🔄 **Live Price Updates** - Dashboard and trading interface sync

## 🏗️ Architecture
```
├── indmoney-api/              # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics.py   # K-Means & GARCH endpoints
│   │   │   ├── assets.py      # Asset & historical data
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── portfolio.py   # Portfolio management
│   │   │   └── websocket.py   # Real-time streaming
│   │   ├── core/
│   │   │   ├── config.py      # Configuration
│   │   │   ├── database.py    # PostgreSQL connection
│   │   │   └── security.py    # JWT & hashing
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/
│   │       └── finnhub_client.py  # Market data API
│   ├── Dockerfile
│   └── requirements.txt
│
├── Frontend Files (HTML/CSS/JS)
│   ├── index.html             # Main application
│   ├── styles.css             # Complete styling
│   ├── script.js              # WebSocket & charts
│   └── serve.py               # HTTP server
│
├── docker-compose.yml         # Orchestration
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Python 3.11+ installed
- 8GB RAM minimum
- Internet connection for API calls

### Step 1: Start Backend Services
```powershell
# Navigate to project directory
cd C:\Users\ASUS\Desktop\DSFM_PF

# Start all Docker containers
docker-compose up -d
```

This starts:
- **PostgreSQL** (port 5432) - Database
- **Redis** (port 6379) - Cache
- **FastAPI** (port 8000) - Backend API

### Step 2: Verify Backend
```powershell
# Check if containers are running
docker ps

# Test API health
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
# Expected: {"status":"healthy"}
```

### Step 3: Start Frontend Server
```powershell
# Start Python HTTP server
python -m http.server 3000

# Or use the serve.py script
python serve.py
```

### Step 4: Open Application
Open your browser and navigate to:
```
http://localhost:3000
```

**⚠️ IMPORTANT**: You MUST use `http://localhost:3000`, NOT `file:///` to open `index.html`. WebSocket connections require HTTP protocol.

## 📋 Available Endpoints

### Backend API (http://localhost:8000)

#### Analytics
- `GET /api/v1/analytics/market-regime?symbol=NIFTY_50` - K-Means classification
- `GET /api/v1/analytics/volatility-forecast?symbol=NIFTY_50` - GARCH forecast

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
2. Check API is running: `docker ps`
3. Check logs: `docker-compose logs api`
4. Restart services: `docker-compose restart api`

### Analytics Showing Errors
**Problem**: Analysis dashboard shows "Failed to load"

**Solution**:
1. Restart API: `docker-compose restart api`
2. Test endpoint directly:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8000/api/v1/analytics/market-regime?symbol=NIFTY_50"
   ```

### Ports Already in Use
**Problem**: Docker fails with "port is already allocated"

**Solution**:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "8001:8000"  # Change 8000 to 8001
   ```

### Database Connection Errors
**Problem**: API logs show "connection refused" to PostgreSQL

**Solution**:
```powershell
# Restart database
docker-compose restart db

# Wait 5 seconds for DB to initialize
Start-Sleep -Seconds 5

# Restart API
docker-compose restart api
```

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

## �️ Development

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### Restart Services
```powershell
# Restart all
docker-compose restart

# Restart API only
docker-compose restart api
```

### Stop Services
```powershell
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Access Database
```powershell
# Connect to PostgreSQL
docker exec -it indmoney_db psql -U indmoney -d indmoney

# List tables
\dt

# Query data
SELECT * FROM assets;
```

## � Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Frontend** | HTML5, CSS3, JavaScript | ES6+ | User interface |
| **Charting** | Lightweight Charts | 4.1.1 | Trading charts |
| **Analytics Charts** | Chart.js | 4.4.0 | ML visualizations |
| **Backend** | FastAPI | Latest | REST API |
| **Server** | Uvicorn | Latest | ASGI server |
| **Language** | Python | 3.11 | Core logic |
| **Database** | PostgreSQL | 15-alpine | Persistence |
| **Cache** | Redis | 7-alpine | Caching |
| **ML - Clustering** | scikit-learn | 1.3.2 | K-Means |
| **ML - Forecasting** | arch | 6.2.0 | GARCH |
| **Data Processing** | numpy, pandas | Latest | Numerical ops |
| **Market Data** | Finnhub API | v1 | Live quotes |
| **Containerization** | Docker | Latest | Deployment |

## 🎯 Project Status

✅ **COMPLETED FEATURES**
- Full-stack architecture with Docker
- GARCH(1,1) volatility forecasting
- K-Means market regime detection (4 clusters)
- Real-time WebSocket streaming
- Interactive trading charts
- Analysis dashboard with ML insights
- INDmoney-style responsive UI
- Consistent analytics (deterministic results)

🔮 **FUTURE ENHANCEMENTS**
- FinBERT sentiment analysis
- LLM-powered market commentary
- User authentication & portfolios
- More stocks (beyond NIFTY/SENSEX)
- Backtesting engine
- Mobile app (React Native)
- NSE/BSE official data integration

## 📞 Support

### For Issues
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [QUICKSTART.md](QUICKSTART.md)
3. Review API docs at http://localhost:8000/docs

### Project Structure
- `indmoney-api/` - Complete backend code
- `index.html` - Frontend application
- `script.js` - Client-side logic
- `styles.css` - UI styling
- `docker-compose.yml` - Service orchestration

## 🎓 Learning Resources
- FastAPI: https://fastapi.tiangolo.com
- Lightweight Charts: https://tradingview.github.io/lightweight-charts/
- GARCH Models: https://arch.readthedocs.io/
- K-Means Clustering: https://scikit-learn.org/stable/modules/clustering.html
- WebSocket Protocol: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

**Status**: ✅ Fully functional prototype ready for demonstration
**Last Updated**: October 31, 2025
**Team**: Deepu James, Yaksh Rohilla, Mukund Madhav Agarwal, Aarav Pratap Singh
