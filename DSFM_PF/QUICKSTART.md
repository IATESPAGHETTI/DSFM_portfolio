# INDmoney API - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Python 3.11+ (for local development)
- Node.js 18+ (for frontend)

### 1. Start the Backend Services

```bash
# Navigate to project directory
cd C:\Users\ASUS\Desktop\DSFM_PF

# Start all Docker services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f api
```

### 2. Test the API

Open http://localhost:8000/docs in your browser to see the interactive API documentation.

### 3. API Endpoints Structure

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

#### WebSocket (`/ws`)
- `WS /ws/assets/{symbol}` - Real-time price updates

### 4. Complete Remaining Files

You need to create these API endpoint files in `indmoney-api/app/api/`:

1. **portfolio.py** - Portfolio management
2. **assets.py** - Asset data endpoints
3. **analytics.py** - K-Means & GARCH results
4. **websocket.py** - Real-time streaming

### 5. Celery Tasks

Create in `indmoney-api/app/tasks/`:

1. **celery_app.py** - Celery configuration
2. **regime_analysis.py** - K-Means clustering (runs daily 1 AM)
3. **volatility_forecast.py** - GARCH forecasting (runs daily 1:05 AM)

### 6. Data Ingester

Create `indmoney-api/app/services/ingester.py`:
- Connects to market data API (Finnhub/Zerodha)
- Publishes real-time ticks to Redis
- WebSocket endpoint subscribes and streams to clients

### 7. Setup React Frontend

```bash
cd indmoney-client
npx create-react-app .
npm install react-router-dom axios lightweight-charts

# Start development server
npm start
```

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

### Database connection issues:
```bash
docker-compose down
docker volume rm dsfm_pf_postgres_data
docker-compose up -d
```

### View service logs:
```bash
docker-compose logs api
docker-compose logs db
docker-compose logs redis
```

### Stop all services:
```bash
docker-compose down
```

## 📚 Next Steps

1. ✅ Complete API endpoint files
2. ✅ Build Celery tasks for ML models
3. ✅ Create data ingester service
4. ✅ Build React frontend
5. ✅ Connect WebSocket for real-time data
6. ✅ Test K-Means & GARCH predictions

## 🎯 Current Status

✅ Database schema
✅ Docker setup
✅ Models & schemas
✅ Authentication
✅ Project structure

🔄 In Progress:
- API endpoints
- Celery tasks
- Data ingester
- React frontend

Happy coding! 🚀
