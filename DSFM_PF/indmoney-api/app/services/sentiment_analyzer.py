"""
FinBERT-based News Sentiment Analyzer for Stock Market
Uses Finnhub API for news and ProsusAI/finbert for sentiment analysis
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from pathlib import Path

# Set PyTorch as the backend to avoid TensorFlow issues
os.environ["TRANSFORMERS_BACKEND"] = "pytorch"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    FinBERT-based sentiment analyzer with Finnhub news integration
    """
    
    def __init__(self, finnhub_api_key: str):
        self.finnhub_api_key = finnhub_api_key
        self.sentiment_analyzer = None
        self.cache_file = Path(__file__).parent.parent.parent / "sentiment_cache.json"
        self._model_loaded = False
        
    def _initialize_finbert(self):
        """Load the pre-trained FinBERT model (lazy loading)"""
        if self._model_loaded:
            return
            
        try:
            logger.info("🤖 Loading FinBERT model...")
            model_name = "ProsusAI/finbert"
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForSequenceClassification.from_pretrained(model_name)
            
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis", 
                model=model, 
                tokenizer=tokenizer,
                truncation=True,
                max_length=512
            )
            self._model_loaded = True
            logger.info("✅ FinBERT model loaded successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to load FinBERT model: {e}")
            self.sentiment_analyzer = None
    
    def fetch_news(self, symbol: str, days_back: int = 7) -> List[Dict]:
        """
        Fetch news headlines from Finnhub API
        
        Args:
            symbol: Stock ticker symbol (e.g., "AAPL", "RELIANCE.NS")
            days_back: Number of days to look back for news
            
        Returns:
            List of news articles with headline, summary, source, etc.
        """
        try:
            # Calculate date range
            to_date = datetime.now()
            from_date = to_date - timedelta(days=days_back)
            
            # Format dates for API (YYYY-MM-DD)
            from_str = from_date.strftime("%Y-%m-%d")
            to_str = to_date.strftime("%Y-%m-%d")
            
            # Finnhub company news endpoint
            url = f"https://finnhub.io/api/v1/company-news"
            params = {
                "symbol": symbol,
                "from": from_str,
                "to": to_str,
                "token": self.finnhub_api_key
            }
            
            logger.info(f"📰 Fetching news for {symbol} from {from_str} to {to_str}")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            news_data = response.json()
            logger.info(f"✅ Found {len(news_data)} articles for {symbol}")
            
            return news_data
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch news for {symbol}: {e}")
            return []
    
    def analyze_sentiment(self, headlines: List[str]) -> Dict:
        """
        Analyze sentiment of news headlines using FinBERT
        
        Args:
            headlines: List of news headlines
            
        Returns:
            Dict with sentiment label, score, and breakdown
        """
        # Lazy load the model on first use
        if not self._model_loaded:
            self._initialize_finbert()
            
        if not self.sentiment_analyzer:
            logger.error("❌ FinBERT model not initialized")
            return {
                "sentiment": "neutral",
                "score": 0.0,
                "confidence": 0.0,
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
                "error": "Model not initialized"
            }
        
        if not headlines:
            return {
                "sentiment": "neutral",
                "score": 0.0,
                "confidence": 0.0,
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
                "total_headlines": 0
            }
        
        try:
            logger.info(f"🔍 Analyzing {len(headlines)} headlines with FinBERT...")
            
            # Analyze all headlines
            results = self.sentiment_analyzer(headlines[:50])  # Limit to 50 for performance
            
            # Calculate aggregate scores
            total_score = 0.0
            sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
            weighted_scores = []
            
            for result in results:
                label = result['label'].lower()
                confidence = result['score']
                
                sentiment_counts[label] += 1
                
                # Convert to numerical score: positive=+1, negative=-1, neutral=0
                if label == 'positive':
                    score_value = confidence
                elif label == 'negative':
                    score_value = -confidence
                else:
                    score_value = 0.0
                
                total_score += score_value
                weighted_scores.append(score_value)
            
            # Calculate final sentiment
            avg_score = total_score / len(headlines) if headlines else 0.0
            avg_confidence = sum(r['score'] for r in results) / len(results)
            
            # Determine overall sentiment label
            if avg_score > 0.15:
                overall_sentiment = "positive"
            elif avg_score < -0.15:
                overall_sentiment = "negative"
            else:
                overall_sentiment = "neutral"
            
            result = {
                "sentiment": overall_sentiment,
                "score": round(avg_score, 4),
                "confidence": round(avg_confidence, 4),
                "breakdown": sentiment_counts,
                "total_headlines": len(headlines),
                "analyzed_headlines": len(results)
            }
            
            logger.info(f"✅ Sentiment: {overall_sentiment} (score: {avg_score:.4f}, confidence: {avg_confidence:.4f})")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Sentiment analysis failed: {e}")
            return {
                "sentiment": "neutral",
                "score": 0.0,
                "confidence": 0.0,
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
                "error": str(e)
            }
    
    def analyze_stock(self, symbol: str, days_back: int = 7) -> Dict:
        """
        Complete analysis: fetch news and analyze sentiment for a stock
        
        Args:
            symbol: Stock ticker symbol
            days_back: Days of news history to analyze
            
        Returns:
            Complete sentiment analysis result
        """
        # Fetch news
        news_articles = self.fetch_news(symbol, days_back)
        
        if not news_articles:
            return {
                "symbol": symbol,
                "sentiment": "neutral",
                "score": 0.0,
                "confidence": 0.0,
                "breakdown": {"positive": 0, "negative": 0, "neutral": 0},
                "total_headlines": 0,
                "message": "No news found"
            }
        
        # Extract headlines
        headlines = [article.get('headline', '') for article in news_articles if article.get('headline')]
        
        # Analyze sentiment
        sentiment_result = self.analyze_sentiment(headlines)
        
        # Add metadata
        sentiment_result['symbol'] = symbol
        sentiment_result['news_sources'] = len(set(a.get('source', '') for a in news_articles))
        sentiment_result['analyzed_at'] = datetime.now().isoformat()
        
        # Add sample headlines (top 5)
        sentiment_result['sample_headlines'] = headlines[:5]
        
        return sentiment_result
    
    def analyze_nifty50_batch(self, nifty50_symbols: List[str]) -> Dict[str, Dict]:
        """
        Analyze all NIFTY 50 stocks and return cached results
        
        Args:
            nifty50_symbols: List of NIFTY 50 stock symbols
            
        Returns:
            Dictionary mapping symbol to sentiment analysis
        """
        logger.info(f"📊 Starting batch analysis for {len(nifty50_symbols)} NIFTY 50 stocks...")
        
        results = {}
        for i, symbol in enumerate(nifty50_symbols, 1):
            logger.info(f"[{i}/{len(nifty50_symbols)}] Analyzing {symbol}...")
            try:
                result = self.analyze_stock(symbol, days_back=7)
                results[symbol] = result
            except Exception as e:
                logger.error(f"❌ Failed to analyze {symbol}: {e}")
                results[symbol] = {
                    "symbol": symbol,
                    "sentiment": "neutral",
                    "score": 0.0,
                    "error": str(e)
                }
        
        # Save to cache
        self.save_cache(results)
        
        logger.info(f"✅ Batch analysis complete! Results cached.")
        return results
    
    def save_cache(self, results: Dict[str, Dict]):
        """Save sentiment results to JSON cache file"""
        try:
            cache_data = {
                "updated_at": datetime.now().isoformat(),
                "results": results
            }
            with open(self.cache_file, 'w') as f:
                json.dump(cache_data, f, indent=2)
            logger.info(f"💾 Cache saved to {self.cache_file}")
        except Exception as e:
            logger.error(f"❌ Failed to save cache: {e}")
    
    def load_cache(self) -> Optional[Dict[str, Dict]]:
        """Load cached sentiment results"""
        try:
            if not self.cache_file.exists():
                logger.info("📭 No cache file found")
                return None
            
            with open(self.cache_file, 'r') as f:
                cache_data = json.load(f)
            
            updated_at = datetime.fromisoformat(cache_data['updated_at'])
            age = datetime.now() - updated_at
            
            logger.info(f"📂 Cache loaded (age: {age.seconds // 60} minutes)")
            
            # Return None if cache is older than 1 hour
            if age.seconds > 3600:
                logger.info("⏰ Cache is stale (>1 hour old)")
                return None
            
            return cache_data['results']
            
        except Exception as e:
            logger.error(f"❌ Failed to load cache: {e}")
            return None
    
    def get_sentiment(self, symbol: str, use_cache: bool = True) -> Dict:
        """
        Get sentiment for a symbol, using cache if available
        
        Args:
            symbol: Stock ticker symbol
            use_cache: Whether to use cached results
            
        Returns:
            Sentiment analysis result
        """
        # Try cache first
        if use_cache:
            cached_results = self.load_cache()
            if cached_results and symbol in cached_results:
                logger.info(f"✅ Using cached sentiment for {symbol}")
                return cached_results[symbol]
        
        # Fall back to on-demand analysis
        logger.info(f"🔄 Running on-demand analysis for {symbol}")
        return self.analyze_stock(symbol)


# NIFTY 50 constituent symbols (updated list)
NIFTY50_SYMBOLS = [
    "ADANIPORTS", "ASIANPAINT", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE",
    "BAJAJFINSV", "BHARTIARTL", "BPCL", "BRITANNIA", "CIPLA",
    "COALINDIA", "DIVISLAB", "DRREDDY", "EICHERMOT", "GRASIM",
    "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO",
    "HINDUNILVR", "ICICIBANK", "INDUSINDBK", "INFY", "ITC",
    "JSWSTEEL", "KOTAKBANK", "LT", "M&M", "MARUTI",
    "NESTLEIND", "NTPC", "ONGC", "POWERGRID", "RELIANCE",
    "SBILIFE", "SBIN", "SHREECEM", "SUNPHARMA", "TATACONSUM",
    "TATAMOTORS", "TATASTEEL", "TCS", "TECHM", "TITAN",
    "ULTRACEMCO", "UPL", "WIPRO", "APOLLOHOSP", "LTIM"
]
