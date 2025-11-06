"""
Scheduled task to update NIFTY 50 sentiment analysis
Run this script hourly using Windows Task Scheduler or cron
"""

import sys
import logging
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.services.sentiment_analyzer import SentimentAnalyzer, NIFTY50_SYMBOLS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def run_nifty50_analysis():
    """Run NIFTY 50 sentiment analysis and cache results"""
    logger.info("=" * 60)
    logger.info("🚀 Starting scheduled NIFTY 50 sentiment analysis")
    logger.info("=" * 60)
    
    # Initialize analyzer
    FINNHUB_API_KEY = "d424ap9r01qreojolqdgd424ap9r01qreojolqe0"
    analyzer = SentimentAnalyzer(finnhub_api_key=FINNHUB_API_KEY)
    
    try:
        # Run batch analysis
        results = analyzer.analyze_nifty50_batch(NIFTY50_SYMBOLS)
        
        # Print summary
        sentiments = [r.get('sentiment', 'neutral') for r in results.values()]
        logger.info(f"\n📊 Analysis Summary:")
        logger.info(f"  ✅ Positive: {sentiments.count('positive')}")
        logger.info(f"  ❌ Negative: {sentiments.count('negative')}")
        logger.info(f"  ⚪ Neutral: {sentiments.count('neutral')}")
        logger.info(f"\n💾 Results cached successfully!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {e}")
        return False


if __name__ == "__main__":
    success = run_nifty50_analysis()
    sys.exit(0 if success else 1)
