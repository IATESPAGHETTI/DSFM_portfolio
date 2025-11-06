"""
News Sentiment API endpoints
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional
import logging

from ..services.sentiment_analyzer import SentimentAnalyzer, NIFTY50_SYMBOLS

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/sentiment", tags=["sentiment"])

# Initialize sentiment analyzer with Finnhub API key
FINNHUB_API_KEY = "d424ap9r01qreojolqdgd424ap9r01qreojolqe0"
analyzer = SentimentAnalyzer(finnhub_api_key=FINNHUB_API_KEY)


@router.get("/stock/{symbol}")
async def get_stock_sentiment(
    symbol: str,
    use_cache: bool = True,
    days_back: int = 7
):
    """
    Get sentiment analysis for a specific stock
    
    - **symbol**: Stock ticker symbol (e.g., "RELIANCE", "TCS", "INFY")
    - **use_cache**: Use cached results if available (default: True)
    - **days_back**: Days of news history to analyze (default: 7)
    """
    try:
        logger.info(f"📊 Sentiment request for {symbol}")
        
        if use_cache:
            result = analyzer.get_sentiment(symbol, use_cache=True)
        else:
            result = analyzer.analyze_stock(symbol, days_back=days_back)
        
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        logger.error(f"❌ Sentiment analysis failed for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/nifty50")
async def get_nifty50_sentiment(force_refresh: bool = False):
    """
    Get sentiment analysis for all NIFTY 50 stocks
    
    - **force_refresh**: Force re-analysis (ignore cache)
    
    Returns cached results if available and less than 1 hour old.
    """
    try:
        logger.info("📊 NIFTY 50 sentiment request")
        
        if force_refresh:
            # Force fresh analysis
            results = analyzer.analyze_nifty50_batch(NIFTY50_SYMBOLS)
        else:
            # Try cache first
            cached_results = analyzer.load_cache()
            if cached_results:
                results = cached_results
            else:
                # No cache, analyze now
                results = analyzer.analyze_nifty50_batch(NIFTY50_SYMBOLS)
        
        # Calculate market sentiment summary
        sentiments = [r.get('sentiment', 'neutral') for r in results.values()]
        breakdown = {
            "positive": sentiments.count('positive'),
            "negative": sentiments.count('negative'),
            "neutral": sentiments.count('neutral')
        }
        
        # Overall market sentiment
        if breakdown['positive'] > breakdown['negative']:
            market_sentiment = "bullish"
        elif breakdown['negative'] > breakdown['positive']:
            market_sentiment = "bearish"
        else:
            market_sentiment = "neutral"
        
        return {
            "success": True,
            "data": {
                "market_sentiment": market_sentiment,
                "breakdown": breakdown,
                "total_stocks": len(results),
                "stocks": results
            }
        }
        
    except Exception as e:
        logger.error(f"❌ NIFTY 50 sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh-nifty50")
async def refresh_nifty50_sentiment(background_tasks: BackgroundTasks):
    """
    Trigger background refresh of NIFTY 50 sentiment analysis
    
    This runs asynchronously and updates the cache.
    Use this for scheduled/periodic updates.
    """
    try:
        logger.info("🔄 Triggering NIFTY 50 sentiment refresh...")
        
        # Run analysis in background
        background_tasks.add_task(
            analyzer.analyze_nifty50_batch,
            NIFTY50_SYMBOLS
        )
        
        return {
            "success": True,
            "message": "NIFTY 50 sentiment analysis started in background"
        }
        
    except Exception as e:
        logger.error(f"❌ Failed to trigger refresh: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-overview")
async def get_market_sentiment_overview():
    """
    Get overall market sentiment with key statistics
    
    Returns a summary of market sentiment based on NIFTY 50 analysis
    """
    try:
        cached_results = analyzer.load_cache()
        
        if not cached_results:
            return {
                "success": False,
                "message": "No cached data available. Run /nifty50 endpoint first."
            }
        
        # Calculate statistics
        sentiments = []
        scores = []
        
        for result in cached_results.values():
            sentiments.append(result.get('sentiment', 'neutral'))
            scores.append(result.get('score', 0.0))
        
        avg_score = sum(scores) / len(scores) if scores else 0.0
        
        breakdown = {
            "positive": sentiments.count('positive'),
            "negative": sentiments.count('negative'),
            "neutral": sentiments.count('neutral')
        }
        
        # Determine market mood
        positive_ratio = breakdown['positive'] / len(sentiments)
        negative_ratio = breakdown['negative'] / len(sentiments)
        
        if positive_ratio > 0.6:
            market_mood = "Very Bullish"
        elif positive_ratio > 0.4:
            market_mood = "Bullish"
        elif negative_ratio > 0.6:
            market_mood = "Very Bearish"
        elif negative_ratio > 0.4:
            market_mood = "Bearish"
        else:
            market_mood = "Neutral"
        
        # Find most positive and negative stocks
        sorted_stocks = sorted(
            cached_results.items(),
            key=lambda x: x[1].get('score', 0.0),
            reverse=True
        )
        
        most_positive = [
            {"symbol": s, "score": r.get('score', 0.0)}
            for s, r in sorted_stocks[:5]
        ]
        
        most_negative = [
            {"symbol": s, "score": r.get('score', 0.0)}
            for s, r in sorted_stocks[-5:]
        ]
        
        return {
            "success": True,
            "data": {
                "market_mood": market_mood,
                "average_sentiment_score": round(avg_score, 4),
                "breakdown": breakdown,
                "breakdown_percentages": {
                    "positive": round(positive_ratio * 100, 1),
                    "negative": round(negative_ratio * 100, 1),
                    "neutral": round((1 - positive_ratio - negative_ratio) * 100, 1)
                },
                "most_positive_stocks": most_positive,
                "most_negative_stocks": most_negative,
                "total_stocks_analyzed": len(cached_results)
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Market overview failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
