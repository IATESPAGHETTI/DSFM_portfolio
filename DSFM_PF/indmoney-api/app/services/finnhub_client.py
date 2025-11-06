import httpx
import asyncio
from typing import List, Dict
from datetime import datetime, timedelta
import json

class FinnhubClient:
    """Finnhub API client for real-time market data"""
    
    def __init__(self, api_key: str = None):
        # Finnhub API key - Updated for real-time data
        self.api_key = api_key or "d424ap9r01qreojolqdgd424ap9r01qreojolqe0"
        self.base_url = "https://finnhub.io/api/v1"
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def get_quote(self, symbol: str) -> Dict:
        """Get real-time quote for a symbol"""
        try:
            url = f"{self.base_url}/quote"
            params = {
                "symbol": symbol,
                "token": self.api_key
            }
            response = await self.client.get(url, params=params)
            data = response.json()
            
            return {
                "symbol": symbol,
                "price": data.get("c", 0),  # current price
                "change": data.get("d", 0),  # change
                "changePercent": data.get("dp", 0),  # change percent
                "high": data.get("h", 0),  # high
                "low": data.get("l", 0),  # low
                "open": data.get("o", 0),  # open
                "previousClose": data.get("pc", 0),  # previous close
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            print(f"Error fetching quote for {symbol}: {e}")
            return None
    
    async def get_candles(self, symbol: str, resolution: str = "D", days: int = 30) -> List[Dict]:
        """Get historical candlestick data
        
        Args:
            symbol: Stock symbol
            resolution: 1, 5, 15, 30, 60, D, W, M
            days: Number of days of historical data
        """
        try:
            end_time = int(datetime.now().timestamp())
            start_time = int((datetime.now() - timedelta(days=days)).timestamp())
            
            url = f"{self.base_url}/stock/candle"
            params = {
                "symbol": symbol,
                "resolution": resolution,
                "from": start_time,
                "to": end_time,
                "token": self.api_key
            }
            
            response = await self.client.get(url, params=params)
            data = response.json()
            
            if data.get("s") != "ok":
                return []
            
            candles = []
            for i in range(len(data.get("t", []))):
                candles.append({
                    "time": data["t"][i],
                    "open": data["o"][i],
                    "high": data["h"][i],
                    "low": data["l"][i],
                    "close": data["c"][i],
                    "volume": data["v"][i]
                })
            
            return candles
        except Exception as e:
            print(f"Error fetching candles for {symbol}: {e}")
            return []
    
    async def get_indian_stocks_quote(self, symbol: str) -> Dict:
        """Get quote for Indian stocks (NSE/BSE)"""
        # Finnhub uses different symbol format for Indian stocks
        # NSE: SYMBOL.NS, BSE: SYMBOL.BO
        indian_symbol = f"{symbol}.NS" if not symbol.endswith((".NS", ".BO")) else symbol
        return await self.get_quote(indian_symbol)
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Singleton instance
finnhub_client = FinnhubClient()


# Symbol mapping for Indian market
INDIAN_SYMBOLS = {
    "NIFTY_50": "^NSEI",
    "SENSEX": "^BSESN",
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "ITC": "ITC.NS",
    "SBIN": "SBIN.NS",
    "BHARTIARTL": "BHARTIARTL.NS"
}


def get_finnhub_symbol(symbol: str) -> str:
    """Convert internal symbol to Finnhub format"""
    return INDIAN_SYMBOLS.get(symbol, f"{symbol}.NS")
