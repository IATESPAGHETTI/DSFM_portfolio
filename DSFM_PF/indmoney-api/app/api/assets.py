from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Asset, HistoricalPrice
from app.schemas import AssetResponse
from typing import List
import random
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/", response_model=List[AssetResponse])
async def get_assets(db: Session = Depends(get_db)):
    """Get all available assets"""
    assets = db.query(Asset).all()
    return assets


@router.get("/{symbol}", response_model=AssetResponse)
async def get_asset(symbol: str, db: Session = Depends(get_db)):
    """Get specific asset details"""
    asset = db.query(Asset).filter(Asset.symbol == symbol).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.get("/{symbol}/history")
async def get_asset_history(symbol: str, days: int = 30, db: Session = Depends(get_db)):
    """Get historical OHLCV data for an asset from Finnhub"""
    from app.services.finnhub_client import finnhub_client, get_finnhub_symbol
    from datetime import datetime
    
    # Convert to Finnhub symbol
    finnhub_symbol = get_finnhub_symbol(symbol)
    
    # Get live data from Finnhub
    candles = await finnhub_client.get_candles(finnhub_symbol, resolution="D", days=days)
    
    if candles:
        return {
            "symbol": symbol,
            "data": [
                {
                    "date": datetime.fromtimestamp(candle["time"]).isoformat(),
                    "open": float(candle["open"]),
                    "high": float(candle["high"]),
                    "low": float(candle["low"]),
                    "close": float(candle["close"]),
                    "volume": int(candle["volume"])
                }
                for candle in candles
            ],
            "source": "finnhub_live"
        }
    
    # Fallback to database or sample data
    asset = db.query(Asset).filter(Asset.symbol == symbol).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Get historical data from DB
    history = db.query(HistoricalPrice).filter(
        HistoricalPrice.asset_symbol == symbol
    ).order_by(HistoricalPrice.date.desc()).limit(days).all()
    
    # If no data, generate sample data
    if not history:
        history = generate_sample_history(100.0, days)
    
    return {
        "symbol": symbol,
        "data": [
            {
                "date": h.date.isoformat() if hasattr(h, 'date') else h['date'],
                "open": float(h.open if hasattr(h, 'open') else h['open']),
                "high": float(h.high if hasattr(h, 'high') else h['high']),
                "low": float(h.low if hasattr(h, 'low') else h['low']),
                "close": float(h.close if hasattr(h, 'close') else h['close']),
                "volume": int(h.volume)
            }
            for h in reversed(history)
        ],
        "source": "fallback"
    }


def generate_sample_history(current_price: float, days: int):
    """Generate sample historical data"""
    data = []
    price = current_price
    base_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        open_price = price
        change = random.uniform(-0.03, 0.03)  # ±3% daily change
        close_price = price * (1 + change)
        high_price = max(open_price, close_price) * random.uniform(1.0, 1.02)
        low_price = min(open_price, close_price) * random.uniform(0.98, 1.0)
        volume = random.randint(1000000, 10000000)
        
        data.append({
            'date': date.isoformat(),
            'open': round(open_price, 2),
            'high': round(high_price, 2),
            'low': round(low_price, 2),
            'close': round(close_price, 2),
            'volume': volume
        })
        price = close_price
    
    return data
