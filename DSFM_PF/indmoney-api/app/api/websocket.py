from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import asyncio
import json
from datetime import datetime
from app.services.finnhub_client import finnhub_client, get_finnhub_symbol

router = APIRouter()

# Store active connections per symbol
active_connections: Dict[str, Set[WebSocket]] = {}


@router.websocket("/ws/assets/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    """WebSocket endpoint for LIVE real-time asset price updates"""
    await websocket.accept()
    
    # Add connection to the symbol's connection set
    if symbol not in active_connections:
        active_connections[symbol] = set()
    active_connections[symbol].add(websocket)
    
    # Convert to Finnhub symbol format
    finnhub_symbol = get_finnhub_symbol(symbol)
    
    # Base prices for simulation fallback
    import random
    base_prices = {
        "NIFTY_50": 19500.0,
        "SENSEX": 65000.0,
        "RELIANCE": 2450.0,
        "TCS": 3600.0
    }
    current_price = base_prices.get(symbol, 1000.0)
    
    try:
        # Fetch and send real-time updates
        while True:
            try:
                # Try to get live quote from Finnhub
                quote = await finnhub_client.get_quote(finnhub_symbol)
                
                if quote and quote.get("price") and quote["price"] > 0:
                    # Send live data from Finnhub
                    await websocket.send_json({
                        "symbol": symbol,
                        "price": quote["price"],
                        "change": quote["change"],
                        "changePercent": quote["changePercent"],
                        "high": quote["high"],
                        "low": quote["low"],
                        "open": quote["open"],
                        "previousClose": quote["previousClose"],
                        "timestamp": quote["timestamp"],
                        "source": "finnhub_live"
                    })
                    current_price = quote["price"]
                else:
                    # Fallback: Simulate live data with small random changes
                    change_percent = random.uniform(-0.3, 0.3)
                    new_price = current_price * (1 + change_percent / 100)
                    change = new_price - current_price
                    
                    await websocket.send_json({
                        "symbol": symbol,
                        "price": round(new_price, 2),
                        "change": round(change, 2),
                        "changePercent": round(change_percent, 2),
                        "high": round(new_price * 1.01, 2),
                        "low": round(new_price * 0.99, 2),
                        "open": round(current_price, 2),
                        "previousClose": round(current_price, 2),
                        "timestamp": datetime.utcnow().isoformat(),
                        "source": "simulated_live"
                    })
                    current_price = new_price
                    
            except Exception as e:
                print(f"Error fetching quote for {symbol}: {e}")
                # Send simulated data on error
                change_percent = random.uniform(-0.3, 0.3)
                new_price = current_price * (1 + change_percent / 100)
                change = new_price - current_price
                
                await websocket.send_json({
                    "symbol": symbol,
                    "price": round(new_price, 2),
                    "change": round(change, 2),
                    "changePercent": round(change_percent, 2),
                    "high": round(new_price * 1.01, 2),
                    "low": round(new_price * 0.99, 2),
                    "open": round(current_price, 2),
                    "previousClose": round(current_price, 2),
                    "timestamp": datetime.utcnow().isoformat(),
                    "source": "simulated_live"
                })
                current_price = new_price
            
            # Update every 2 seconds for live feeling
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        # Remove connection when client disconnects
        active_connections[symbol].discard(websocket)
        if not active_connections[symbol]:
            del active_connections[symbol]
    except Exception as e:
        print(f"WebSocket error for {symbol}: {e}")
        try:
            await websocket.close()
        except:
            pass
        finally:
            active_connections[symbol].discard(websocket)
            if not active_connections[symbol]:
                del active_connections[symbol]
