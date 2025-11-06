# 📰 FinBERT News Sentiment Analysis

## Overview

This feature provides AI-powered news sentiment analysis for Indian stock market using:
- **FinBERT** (ProsusAI/finbert) - Financial domain-specific BERT model
- **Finnhub API** - Real-time news data source
- **Hybrid Approach** - Combines on-demand analysis with cached batch results

## Features

### 1. Real-Time Sentiment Analysis
- Analyzes news headlines using state-of-the-art FinBERT model
- Provides sentiment scores (-1 to +1 scale)
- Confidence levels for each analysis
- Sample headlines display

### 2. Market Overview Dashboard
- Overall NIFTY 50 market sentiment
- Bullish/Bearish/Neutral breakdown
- Top 5 most positive/negative stocks
- Market mood indicator

### 3. Hybrid Performance Strategy
- **On-Demand**: Real-time analysis for individual stocks (2-3 seconds)
- **Cached**: Pre-computed NIFTY 50 results (instant access)
- **Scheduled**: Hourly batch updates for all NIFTY 50 stocks

## API Endpoints

### Get Stock Sentiment
```
GET /api/v1/sentiment/stock/{symbol}
Parameters:
  - use_cache: boolean (default: true)
  - days_back: integer (default: 7)
```

### Get NIFTY 50 Market Sentiment
```
GET /api/v1/sentiment/nifty50
Parameters:
  - force_refresh: boolean (default: false)
```

### Get Market Overview
```
GET /api/v1/sentiment/market-overview
```

### Trigger Background Refresh
```
POST /api/v1/sentiment/refresh-nifty50
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd indmoney-api
pip install transformers torch requests
```

### 2. Configure API Key
The Finnhub API key is already configured in the code:
```python
FINNHUB_API_KEY = "d424ap9r01qreojolqdgd424ap9r01qreojolqe0"
```

### 3. Start the Backend Server
```bash
cd indmoney-api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run Initial NIFTY 50 Analysis (Optional)
```bash
cd indmoney-api
python app/tasks/update_sentiment.py
```

This will:
- Analyze all 50 NIFTY stocks
- Cache results in `sentiment_cache.json`
- Take 10-15 minutes to complete

### 5. Access the Frontend
1. Start frontend server: `python serve.py`
2. Open http://localhost:3000
3. Go to INDstocks page
4. Click the **NEWS** button (purple button in top bar)

## Scheduled Updates

For automatic hourly updates, set up a scheduled task:

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily, repeat every 1 hour
4. Action: Start Program
   - Program: `python`
   - Arguments: `c:\path\to\DSFM_PF\indmoney-api\app\tasks\update_sentiment.py`
   - Start in: `c:\path\to\DSFM_PF\indmoney-api`

### Linux/Mac Cron
```bash
# Edit crontab
crontab -e

# Add this line (runs every hour)
0 * * * * cd /path/to/DSFM_PF/indmoney-api && python app/tasks/update_sentiment.py
```

## Usage in Frontend

### Opening the Modal
Click the **NEWS** button in the INDstocks page top bar.

### Features in Modal
1. **Market Sentiment Badge**
   - Shows overall market mood (Bullish/Bearish/Neutral)
   - Color-coded for quick identification

2. **Sentiment Breakdown**
   - Percentage of positive/neutral/negative stocks
   - Visual statistics

3. **Stock Sentiment Analysis**
   - Circular progress indicator (0-100 score)
   - Sentiment label (Positive/Negative/Neutral)
   - Confidence percentage
   - Number of headlines and sources analyzed
   - Sample recent headlines

4. **Top Movers**
   - Most bullish stocks (highest positive sentiment)
   - Most bearish stocks (highest negative sentiment)

### Refresh Options
- **Auto-refresh**: Uses cached data (instant)
- **Manual refresh**: Click "Refresh" button (triggers new analysis if cache is stale)

## Technical Details

### FinBERT Model
- **Model**: ProsusAI/finbert
- **Type**: BERT-based financial sentiment classifier
- **Classes**: Positive, Negative, Neutral
- **Accuracy**: ~95% on financial text
- **Speed**: ~50 headlines in 2-3 seconds

### Sentiment Score Calculation
```python
# Convert FinBERT output to numerical score
for result in results:
    if label == 'positive':
        score += confidence  # +0 to +1
    elif label == 'negative':
        score -= confidence  # -1 to 0
    else:
        score += 0  # neutral

average_score = total_score / num_headlines
```

### Classification Thresholds
- **Positive**: score > 0.15
- **Negative**: score < -0.15
- **Neutral**: -0.15 ≤ score ≤ 0.15

## File Structure

```
indmoney-api/
├── app/
│   ├── main.py                    # FastAPI app with sentiment router
│   ├── api/
│   │   └── sentiment.py           # Sentiment API endpoints
│   ├── services/
│   │   └── sentiment_analyzer.py  # FinBERT analyzer class
│   └── tasks/
│       └── update_sentiment.py    # Scheduled task script
└── sentiment_cache.json           # Cached NIFTY 50 results

DSFM_PF/
├── index.html                     # NEWS button and modal HTML
├── styles.css                     # News modal styling
└── script.js                      # News modal functionality
```

## Performance Optimization

### First-Time Model Load
- FinBERT downloads on first run (~440MB)
- Cached locally for subsequent runs
- Takes ~30-60 seconds initially

### Cache Strategy
- **TTL**: 1 hour
- **Format**: JSON file
- **Size**: ~50KB for 50 stocks
- **Update**: Automatic on stale cache

### API Rate Limits
- **Finnhub Free Tier**: 60 API calls/minute
- **Batch Analysis**: Uses 50 calls (one per stock)
- **Cooldown**: Run batch max once per hour

## Troubleshooting

### Issue: "Model not initialized"
**Solution**: Wait for FinBERT to download (first run only)

### Issue: "No news found"
**Solution**: 
- Check Finnhub API key is valid
- Verify stock symbol is correct
- Try increasing `days_back` parameter

### Issue: "Cache is stale"
**Solution**: 
- Run scheduled task manually
- Or use `force_refresh=true` parameter

### Issue: Modal not appearing
**Solution**:
- Check browser console for errors
- Verify backend server is running on port 8000
- Hard refresh browser (Ctrl+Shift+R)

## API Response Examples

### Stock Sentiment Response
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "sentiment": "positive",
    "score": 0.4521,
    "confidence": 0.8934,
    "breakdown": {
      "positive": 12,
      "negative": 3,
      "neutral": 5
    },
    "total_headlines": 20,
    "news_sources": 8,
    "sample_headlines": [
      "Reliance Q3 profits surge 20%...",
      "Jio expands 5G coverage to 500 cities..."
    ],
    "analyzed_at": "2025-10-31T15:30:00"
  }
}
```

### Market Overview Response
```json
{
  "success": true,
  "data": {
    "market_mood": "Bullish",
    "average_sentiment_score": 0.2134,
    "breakdown_percentages": {
      "positive": 58.0,
      "negative": 18.0,
      "neutral": 24.0
    },
    "most_positive_stocks": [
      {"symbol": "TCS", "score": 0.7821},
      {"symbol": "INFY", "score": 0.6543}
    ],
    "most_negative_stocks": [
      {"symbol": "TATASTEEL", "score": -0.5234}
    ]
  }
}
```

## Future Enhancements

- [ ] Real-time news streaming via WebSocket
- [ ] Sector-wise sentiment analysis
- [ ] Historical sentiment tracking
- [ ] Sentiment vs price correlation charts
- [ ] Custom alert thresholds
- [ ] Multi-language news support (Hindi, etc.)
- [ ] Integration with Twitter/Reddit sentiment

## Credits

- **FinBERT Model**: ProsusAI (Hugging Face)
- **News Data**: Finnhub.io
- **ML Framework**: Transformers (Hugging Face)
- **Backend**: FastAPI
- **Frontend**: Vanilla JavaScript

## License

Part of the INDmoney Clone project - IIT Delhi DSFM Course 2025
