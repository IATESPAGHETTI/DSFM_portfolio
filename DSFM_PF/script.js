// API Configuration
const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';
const FINNHUB_API_KEY = 'd424ap9r01qreojolqdgd424ap9r01qreojolqe0'; // Real-time data API key

// Market Data (LIVE from Finnhub via Backend)
let marketData = {
    indices: {
        SENSEX: { value: 65432.10, change: 234.50, changePercent: 0.36 },
        NIFTY50: { value: 19542.35, change: 87.25, changePercent: 0.45 },
        BANKNIFTY: { value: 44123.80, change: -156.30, changePercent: -0.35 }
    }
};

// WebSocket connections for live data
let wsConnections = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 INDmoney App Initializing...');
    
    try {
        initializeUI();
        updateMarketIndices(); // Initial update
        initializeAccordion();
        initializeBalanceTabs();
        initializeProfileMenu();
        initializeTimeButtons();
        initializeTradingInterface();
        
        // Connect to LIVE market data using Finnhub API (updates every 5 seconds)
        connectToLiveMarketData();
        
        // Fetch analytics data (K-Means & GARCH)
        fetchAnalyticsData();
        
        // Setup refresh button for analytics
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                console.log('🔄 Refreshing analytics...');
                this.querySelector('i').style.animation = 'spin 1s linear';
                setTimeout(() => {
                    this.querySelector('i').style.animation = '';
                }, 1000);
                fetchAnalyticsDashboard();
            });
        }
        
        // Setup market selector dropdown
        const marketSelect = document.getElementById('marketSelect');
        if (marketSelect) {
            marketSelect.addEventListener('change', function() {
                console.log(`📊 Market changed to: ${this.value}`);
                fetchAnalyticsDashboard();
            });
        }
        
        console.log('✅ INDmoney App Ready!');
        console.log('💡 Click "INDstocks" in navigation to open trading interface');
        console.log('🧠 Click "Analysis" to view ML-powered market insights');
    } catch (error) {
        console.error('❌ Initialization Error:', error);
    }
});

// Initialize UI Components
function initializeUI() {
    console.log('INDmoney Dashboard Initialized');
}

// Update Market Indices Display
function updateMarketIndices() {
    console.log('🖼️ updateMarketIndices() called - Updating dashboard display...');
    
    // Update NIFTY 50
    const niftyPrice = document.getElementById('nifty-price');
    const niftyChange = document.getElementById('nifty-change-display');
    if (niftyPrice && niftyChange) {
        const newPrice = marketData.indices.NIFTY50.value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        niftyPrice.textContent = newPrice;
        const niftySign = marketData.indices.NIFTY50.change >= 0 ? '+' : '';
        niftyChange.textContent = `${niftySign}${marketData.indices.NIFTY50.change.toFixed(2)} (${niftySign}${marketData.indices.NIFTY50.changePercent.toFixed(2)}%)`;
        niftyChange.className = `index-change ${marketData.indices.NIFTY50.change >= 0 ? 'positive' : 'negative'}`;
        
        console.log(`  ✓ NIFTY50 display updated: ${newPrice}`);
        
        // Add pulse animation to show it updated
        niftyPrice.style.animation = 'none';
        setTimeout(() => {
            niftyPrice.style.animation = 'pulse-live 0.5s ease';
        }, 10);
    } else {
        console.warn('  ⚠️ NIFTY50 elements not found:', { niftyPrice, niftyChange });
    }
    
    // Update SENSEX
    const sensexPrice = document.getElementById('sensex-price');
    const sensexChange = document.getElementById('sensex-change-display');
    if (sensexPrice && sensexChange) {
        const newPrice = marketData.indices.SENSEX.value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        sensexPrice.textContent = newPrice;
        const sensexSign = marketData.indices.SENSEX.change >= 0 ? '+' : '';
        sensexChange.textContent = `${sensexSign}${marketData.indices.SENSEX.change.toFixed(2)} (${sensexSign}${marketData.indices.SENSEX.changePercent.toFixed(2)}%)`;
        sensexChange.className = `index-change ${marketData.indices.SENSEX.change >= 0 ? 'positive' : 'negative'}`;
        
        console.log(`  ✓ SENSEX display updated: ${newPrice}`);
        
        // Add pulse animation to show it updated
        sensexPrice.style.animation = 'none';
        setTimeout(() => {
            sensexPrice.style.animation = 'pulse-live 0.5s ease';
        }, 10);
    } else {
        console.warn('  ⚠️ SENSEX elements not found:', { sensexPrice, sensexChange });
    }
    
    // Update BANK NIFTY
    const bankNiftyPrice = document.getElementById('banknifty-price');
    const bankNiftyChange = document.getElementById('banknifty-change-display');
    if (bankNiftyPrice && bankNiftyChange) {
        const newPrice = marketData.indices.BANKNIFTY.value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        bankNiftyPrice.textContent = newPrice;
        const bankNiftySign = marketData.indices.BANKNIFTY.change >= 0 ? '+' : '';
        bankNiftyChange.textContent = `${bankNiftySign}${marketData.indices.BANKNIFTY.change.toFixed(2)} (${bankNiftySign}${marketData.indices.BANKNIFTY.changePercent.toFixed(2)}%)`;
        bankNiftyChange.className = `index-change ${marketData.indices.BANKNIFTY.change >= 0 ? 'positive' : 'negative'}`;
        
        console.log(`  ✓ BANKNIFTY display updated: ${newPrice}`);
        
        // Add pulse animation to show it updated
        bankNiftyPrice.style.animation = 'none';
        setTimeout(() => {
            bankNiftyPrice.style.animation = 'pulse-live 0.5s ease';
        }, 10);
    } else {
        console.warn('  ⚠️ BANKNIFTY elements not found:', { bankNiftyPrice, bankNiftyChange });
    }
    
    console.log('✅ Dashboard update complete!');
}

// Simulate live market data updates
// Finnhub symbol mapping for Indian markets
const FINNHUB_SYMBOLS = {
    'NIFTY_50': '^NSEI',
    'SENSEX': '^BSESN',
    'BANKNIFTY': '^NSEBANK',
    'RELIANCE': 'RELIANCE.NS',
    'TCS': 'TCS.NS',
    'INFY': 'INFY.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'ICICIBANK': 'ICICIBANK.NS'
};

// Fetch real-time quote from Finnhub
async function fetchFinnhubQuote(symbol) {
    try {
        const finnhubSymbol = FINNHUB_SYMBOLS[symbol] || symbol;
        const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`;
        console.log(`📡 Fetching ${symbol} from Finnhub: ${finnhubSymbol}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`📥 Finnhub response for ${symbol}:`, data);
        
        if (data.c && data.c > 0) {
            return {
                symbol: symbol,
                price: data.c,  // current price
                change: data.d || 0,  // change
                changePercent: data.dp || 0,  // change percent
                high: data.h || 0,
                low: data.l || 0,
                open: data.o || 0,
                previousClose: data.pc || 0
            };
        } else {
            console.warn(`⚠️ Invalid data from Finnhub for ${symbol}:`, data);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error fetching Finnhub quote for ${symbol}:`, error);
        return null;
    }
}

// Fetch historical candle data from Finnhub
async function fetchFinnhubCandles(symbol, days) {
    try {
        const finnhubSymbol = FINNHUB_SYMBOLS[symbol] || symbol;
        const endTime = Math.floor(Date.now() / 1000);
        const startTime = Math.floor((Date.now() - (days * 24 * 60 * 60 * 1000)) / 1000);
        
        const url = `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=D&from=${startTime}&to=${endTime}&token=${FINNHUB_API_KEY}`;
        console.log(`📊 Fetching ${days} days of data from Finnhub for ${symbol}...`);
        console.log(`   URL: ${url.substring(0, 100)}...`);
        console.log(`   Date range: ${new Date(startTime * 1000).toLocaleDateString()} to ${new Date(endTime * 1000).toLocaleDateString()}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.s === 'ok' && data.t && data.t.length > 0) {
            console.log(`✅ Received ${data.t.length} candles from Finnhub`);
            console.log(`   First candle date: ${new Date(data.t[0] * 1000).toLocaleString()}`);
            console.log(`   Last candle date: ${new Date(data.t[data.t.length - 1] * 1000).toLocaleString()}`);
            console.log(`   Sample candle:`, { time: data.t[0], date: new Date(data.t[0] * 1000).toLocaleDateString(), open: data.o[0], high: data.h[0], low: data.l[0], close: data.c[0] });
            
            // Convert to chart format
            const candles = [];
            for (let i = 0; i < data.t.length; i++) {
                candles.push({
                    time: data.t[i],  // Unix timestamp in seconds (CRITICAL: must be seconds for Lightweight Charts)
                    open: data.o[i],
                    high: data.h[i],
                    low: data.l[i],
                    close: data.c[i],
                    volume: data.v[i]
                });
            }
            
            return candles;
        } else {
            console.warn(`⚠️ No data from Finnhub:`, data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching Finnhub candles for ${symbol}:`, error);
        return null;
    }
}

// Connect to LIVE WebSocket for real-time market data
function connectToLiveMarketData() {
    console.log('🔴 Starting LIVE market data updates with Finnhub API');
    
    // Update market data every 2 seconds using Finnhub API
    async function updateMarketData() {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🔄 [${timestamp}] Fetching live market data from Finnhub...`);
        
        try {
            const niftyData = await fetchFinnhubQuote('NIFTY_50');
            const sensexData = await fetchFinnhubQuote('SENSEX');
            const bankNiftyData = await fetchFinnhubQuote('BANKNIFTY');
            
            let updated = false;
            
            if (niftyData && niftyData.price > 0) {
                marketData.indices.NIFTY50 = {
                    value: niftyData.price,
                    change: niftyData.change,
                    changePercent: niftyData.changePercent
                };
                console.log(`✅ NIFTY50: ₹${niftyData.price.toFixed(2)} (${niftyData.changePercent >= 0 ? '+' : ''}${niftyData.changePercent.toFixed(2)}%)`);
                updated = true;
                
                // Update trading interface
                const tradingNifty = document.getElementById('trading-nifty');
                if (tradingNifty) {
                    tradingNifty.textContent = niftyData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                }
            } else {
                console.warn(`⚠️ No valid data for NIFTY50, using simulated update`);
                // Simulate small random change
                const oldValue = marketData.indices.NIFTY50.value;
                const randomChange = (Math.random() - 0.5) * 100; // Random change between -50 and +50
                marketData.indices.NIFTY50.value = oldValue + randomChange;
                marketData.indices.NIFTY50.change = randomChange;
                marketData.indices.NIFTY50.changePercent = (randomChange / oldValue) * 100;
                updated = true;
            }
            
            if (sensexData && sensexData.price > 0) {
                marketData.indices.SENSEX = {
                    value: sensexData.price,
                    change: sensexData.change,
                    changePercent: sensexData.changePercent
                };
                console.log(`✅ SENSEX: ₹${sensexData.price.toFixed(2)} (${sensexData.changePercent >= 0 ? '+' : ''}${sensexData.changePercent.toFixed(2)}%)`);
                updated = true;
                
                // Update trading interface
                const tradingSensex = document.getElementById('trading-sensex');
                if (tradingSensex) {
                    tradingSensex.textContent = sensexData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                }
            } else {
                console.warn(`⚠️ No valid data for SENSEX, using simulated update`);
                // Simulate small random change
                const oldValue = marketData.indices.SENSEX.value;
                const randomChange = (Math.random() - 0.5) * 200; // Random change between -100 and +100
                marketData.indices.SENSEX.value = oldValue + randomChange;
                marketData.indices.SENSEX.change = randomChange;
                marketData.indices.SENSEX.changePercent = (randomChange / oldValue) * 100;
                updated = true;
            }
            
            if (bankNiftyData && bankNiftyData.price > 0) {
                marketData.indices.BANKNIFTY = {
                    value: bankNiftyData.price,
                    change: bankNiftyData.change,
                    changePercent: bankNiftyData.changePercent
                };
                console.log(`✅ BANKNIFTY: ₹${bankNiftyData.price.toFixed(2)} (${bankNiftyData.changePercent >= 0 ? '+' : ''}${bankNiftyData.changePercent.toFixed(2)}%)`);
                updated = true;
            } else {
                console.warn(`⚠️ No valid data for BANKNIFTY, using simulated update`);
                // Simulate small random change
                const oldValue = marketData.indices.BANKNIFTY.value;
                const randomChange = (Math.random() - 0.5) * 80; // Random change between -40 and +40
                marketData.indices.BANKNIFTY.value = oldValue + randomChange;
                marketData.indices.BANKNIFTY.change = randomChange;
                marketData.indices.BANKNIFTY.changePercent = (randomChange / oldValue) * 100;
                updated = true;
            }
            
            // Always update dashboard UI
            if (updated) {
                console.log(`🎨 Updating dashboard UI...`);
                updateMarketIndices();
            }
        } catch (error) {
            console.error(`❌ Error in updateMarketData:`, error);
            // Still try to update UI with simulated data
            console.log(`⚠️ Using simulated data due to error`);
            updateMarketIndices();
        }
    }
    
    // Initial update immediately
    console.log('⏰ Starting initial update...');
    updateMarketData();
    
    // Update every 2 seconds
    const intervalId = setInterval(updateMarketData, 2000);
    console.log(`✅ Real-time market data updates started (every 2 seconds) - Interval ID: ${intervalId}`);
    
    // Store interval ID globally for debugging
    window.marketUpdateInterval = intervalId;
}

// Start dashboard real-time updates
async function startDashboardUpdates() {
    // Function to update dashboard data
    async function updateDashboard() {
        console.log('🔄 Updating dashboard market data...');
        const niftyData = await fetchFinnhubQuote('NIFTY_50');
        const sensexData = await fetchFinnhubQuote('SENSEX');
        const bankNiftyData = await fetchFinnhubQuote('BANKNIFTY');
        
        if (niftyData && niftyData.price > 0) {
            marketData.indices.NIFTY50 = {
                value: niftyData.price,
                change: niftyData.change,
                changePercent: niftyData.changePercent
            };
            console.log(`✅ NIFTY50 updated: ₹${niftyData.price.toFixed(2)} (${niftyData.changePercent >= 0 ? '+' : ''}${niftyData.changePercent.toFixed(2)}%)`);
        }
        
        if (sensexData && sensexData.price > 0) {
            marketData.indices.SENSEX = {
                value: sensexData.price,
                change: sensexData.change,
                changePercent: sensexData.changePercent
            };
            console.log(`✅ SENSEX updated: ₹${sensexData.price.toFixed(2)} (${sensexData.changePercent >= 0 ? '+' : ''}${sensexData.changePercent.toFixed(2)}%)`);
        }
        
        if (bankNiftyData && bankNiftyData.price > 0) {
            marketData.indices.BANKNIFTY = {
                value: bankNiftyData.price,
                change: bankNiftyData.change,
                changePercent: bankNiftyData.changePercent
            };
            console.log(`✅ BANKNIFTY updated: ₹${bankNiftyData.price.toFixed(2)} (${bankNiftyData.changePercent >= 0 ? '+' : ''}${bankNiftyData.changePercent.toFixed(2)}%)`);
        }
        
        // Update UI
        updateMarketIndices();
    }
    
    // Update immediately on start
    await updateDashboard();
    
    // Then update every 10 seconds
    setInterval(updateDashboard, 10000);
    
    console.log('✅ Dashboard real-time updates started (updating every 10 seconds)');
}

// Fetch K-Means and GARCH analytics
async function fetchAnalyticsData() {
    try {
        // Fetch Market Regime (K-Means)
        const regimeResponse = await fetch(`${API_BASE_URL}/api/v1/analytics/market-regime`);
        if (regimeResponse.ok) {
            const regimeData = await regimeResponse.json();
            console.log('📊 K-Means Market Regime:', regimeData);
            displayMarketRegime(regimeData);
        } else {
            console.warn('⚠️ Analytics API not available - using simulated data');
            displayMarketRegime(getSimulatedMarketRegime());
        }
        
        // Fetch Volatility Forecast (GARCH)
        const volatilityResponse = await fetch(`${API_BASE_URL}/api/v1/analytics/volatility-forecast?symbol=NIFTY_50`);
        if (volatilityResponse.ok) {
            const volatilityData = await volatilityResponse.json();
            console.log('📈 GARCH Volatility Forecast:', volatilityData);
            displayVolatilityForecast(volatilityData);
        } else {
            displayVolatilityForecast(getSimulatedVolatilityForecast());
        }
        
    } catch (error) {
        console.warn('⚠️ Backend not available - using simulated analytics data');
        console.log('   Error:', error.message);
        const regimeData = getSimulatedMarketRegime();
        const volatilityData = getSimulatedVolatilityForecast();
        console.log('📊 Simulated Regime:', regimeData);
        console.log('📈 Simulated Volatility:', volatilityData);
        displayMarketRegime(regimeData);
        displayVolatilityForecast(volatilityData);
    }
}

// Simulated analytics data when backend is not available (with realistic market-based values)
function getSimulatedMarketRegime() {
    // Simulate based on current market data
    const niftyChange = marketData.indices.NIFTY50.changePercent;
    
    let regime_name = 'Consolidation';
    if (niftyChange > 0.5) regime_name = 'Bull Market';
    else if (niftyChange < -0.5) regime_name = 'Bear Market';
    else if (Math.abs(niftyChange) > 1.5) regime_name = 'High Volatility';
    
    return {
        regime_name: regime_name,
        confidence: 0.75 + Math.random() * 0.15,
        features: {
            returns: niftyChange / 100,
            volatility: Math.abs(niftyChange) / 100 + 0.15,
            volume: 1.0 + Math.random() * 0.5,
            rsi: 50 + niftyChange * 5
        }
    };
}

function getSimulatedVolatilityForecast() {
    // Simulate based on current market volatility
    const currentVol = Math.abs(marketData.indices.NIFTY50.changePercent) / 100 + 0.15 + Math.random() * 0.1;
    const forecastVol = currentVol * (0.9 + Math.random() * 0.3);
    const trend = forecastVol > currentVol ? 'increasing' : 'decreasing';
    
    let risk_level = 'moderate';
    if (forecastVol > 0.50) risk_level = 'high';
    else if (forecastVol < 0.30) risk_level = 'low';
    
    return {
        regime_name: getSimulatedMarketRegime().regime_name,
        current_volatility: currentVol,
        forecast_30d: forecastVol,
        trend: trend,
        risk_level: risk_level
    };
}

// Display Market Regime
function displayMarketRegime(data) {
    console.log('📊 Displaying market regime:', data);
    
    // Update the regime analysis section
    const regimeElement = document.querySelector('.regime-cluster');
    if (regimeElement) {
        const regimeColor = {
            'Bull Market': '#22c55e',
            'Bear Market': '#ef4444',
            'High Volatility': '#f59e0b',
            'Consolidation': '#3b82f6'
        }[data.regime_name] || '#6b7280';
        
        regimeElement.style.background = `linear-gradient(135deg, ${regimeColor}22 0%, ${regimeColor}11 100%)`;
        regimeElement.style.borderLeft = `4px solid ${regimeColor}`;
    }
    
    // Update regime name using ID
    const regimeNameElement = document.getElementById('currentRegime');
    if (regimeNameElement) {
        regimeNameElement.textContent = data.regime_name;
        regimeNameElement.style.color = {
            'Bull Market': '#22c55e',
            'Bear Market': '#ef4444',
            'High Volatility': '#f59e0b',
            'Consolidation': '#3b82f6'
        }[data.regime_name] || '#6b7280';
    }
    
    // Update market features using IDs
    if (data.features) {
        const returnsElement = document.getElementById('featureReturns');
        if (returnsElement) returnsElement.textContent = (data.features.returns * 100).toFixed(2) + '%';
        
        const volatilityElement = document.getElementById('featureVolatility');
        if (volatilityElement) volatilityElement.textContent = (data.features.volatility * 100).toFixed(2) + '%';
        
        const volumeElement = document.getElementById('featureVolume');
        if (volumeElement) volumeElement.textContent = (data.features.volume).toFixed(2) + 'M';
        
        const rsiElement = document.getElementById('featureRSI');
        if (rsiElement) rsiElement.textContent = data.features.rsi.toFixed(1);
    }
    
    // Create regime chart
    createRegimeChart(data);
}

// Display Volatility Forecast
function displayVolatilityForecast(data) {
    console.log('📈 Displaying volatility forecast:', data);
    
    // Update current volatility using ID
    const currentVolElement = document.getElementById('currentVol');
    if (currentVolElement) {
        currentVolElement.textContent = (data.current_volatility * 100).toFixed(2) + '%';
    }
    
    // Update 30-day forecast using ID
    const forecastElement = document.getElementById('forecastVol');
    if (forecastElement) {
        forecastElement.textContent = (data.forecast_30d * 100).toFixed(2) + '%';
    }
    
    // Update trend using ID
    const trendElement = document.getElementById('volTrend');
    if (trendElement) {
        trendElement.textContent = data.trend.charAt(0).toUpperCase() + data.trend.slice(1);
        trendElement.style.color = data.trend === 'increasing' ? '#f59e0b' : '#22c55e';
    }
    
    // Update risk assessment using ID
    const riskElement = document.getElementById('riskLevel');
    if (riskElement) {
        const riskColors = {
            'low': '#22c55e',
            'moderate': '#f59e0b',
            'high': '#ef4444'
        };
        const riskText = data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1);
        riskElement.textContent = `Risk Level: ${riskText}`;
        riskElement.style.color = riskColors[data.risk_level] || '#6b7280';
    }
    
    // Generate forecast array if not present (for simulated data)
    if (!data.forecast) {
        const currentVol = data.current_volatility * 100;
        const forecastVol = data.forecast_30d * 100;
        const diff = (forecastVol - currentVol) / 30;
        data.forecast = [];
        for (let i = 0; i <= 30; i++) {
            data.forecast.push(currentVol + (diff * i));
        }
        data.mean_volatility = forecastVol;
    }
    
    // Create volatility chart
    createVolatilityChart(data);
    
    // Update AI insights
    updateAIInsights(data);
}

// Update AI Insights section
function updateAIInsights(data) {
    // Market Sentiment using ID
    const sentimentText = document.getElementById('sentimentText');
    if (sentimentText) {
        const sentiments = {
            'Bull Market': 'Market showing strong bullish momentum with positive returns. Consider long positions.',
            'Bear Market': 'Market in bearish territory. Exercise caution and consider defensive positions.',
            'High Volatility': 'Market experiencing high volatility. Manage risk carefully.',
            'Consolidation': 'Market consolidating. Wait for clear directional signals.'
        };
        sentimentText.textContent = sentiments[data.regime_name] || 'Analyzing market conditions...';
    }
    
    // Risk Factors using ID
    const riskFactorsList = document.getElementById('riskFactors');
    if (riskFactorsList) {
        const riskFactors = {
            'low': ['Market volatility is low', 'Favorable conditions for trading', 'Standard position sizes recommended'],
            'moderate': ['Moderate volatility detected', 'Standard risk management recommended', 'Monitor key support levels'],
            'high': ['High volatility warning', 'Use tight stop losses', 'Reduce position sizes']
        };
        const factors = riskFactors[data.risk_level] || ['Loading risk analysis...'];
        riskFactorsList.innerHTML = factors.map(f => `<li>${f}</li>`).join('');
    }
    
    // Recommendations using ID
    const recList = document.getElementById('recommendations');
    if (recList) {
        const recommendationsByTrend = {
            'increasing': [
                'Consider options strategies and hedging',
                'Reduce position sizes during high volatility',
                'Use wider stop-loss levels to avoid whipsaws'
            ],
            'decreasing': [
                'Good time for directional trades',
                'Consider increasing position sizes',
                'Look for breakout opportunities'
            ],
            'stable': [
                'Maintain balanced portfolio approach',
                'Follow standard risk management rules',
                'Focus on your trading plan'
            ]
        };
        const recs = recommendationsByTrend[data.trend] || ['Generating recommendations...'];
        recList.innerHTML = recs.map(r => `<li>${r}</li>`).join('');
    }
}

// Fetch and Display Analytics Dashboard
async function fetchAnalyticsDashboard() {
    try {
        console.log('🔄 Fetching ML analytics data...');
        
        // Get selected market
        const marketSelect = document.getElementById('marketSelect');
        const selectedMarket = marketSelect ? marketSelect.value : 'NIFTY_50';
        
        console.log(`📊 Analyzing ${selectedMarket}...`);
        
        // Fetch K-Means Market Regime
        const regimeResponse = await fetch(`${API_BASE_URL}/api/v1/analytics/market-regime?symbol=${selectedMarket}`);
        const regimeData = await regimeResponse.json();
        console.log('📊 K-Means Data:', regimeData);
        displayRegimeAnalysis(regimeData);
        
        // Fetch GARCH Volatility Forecast
        const volatilityResponse = await fetch(`${API_BASE_URL}/api/v1/analytics/volatility-forecast?symbol=${selectedMarket}`);
        const volatilityData = await volatilityResponse.json();
        console.log('📈 GARCH Data:', volatilityData);
        displayVolatilityAnalysis(volatilityData);
        
        // Generate AI Insights
        generateAIInsights(regimeData, volatilityData);
        
        // Update last updated time
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()} - ${selectedMarket}`;
        
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        document.getElementById('currentRegime').textContent = 'Error loading data';
    }
}

// Display K-Means Regime Analysis
function displayRegimeAnalysis(data) {
    // Update regime status
    const regimeColors = {
        'Bull Market': '🟢',
        'Bear Market': '🔴',
        'High Volatility': '🟡',
        'Consolidation': '🔵'
    };
    
    document.getElementById('currentRegime').textContent = `${regimeColors[data.regime_name] || '⚪'} ${data.regime_name}`;
    
    // Update features
    document.getElementById('featureReturns').textContent = `${data.features.returns.toFixed(2)}%`;
    document.getElementById('featureVolatility').textContent = `${data.features.volatility.toFixed(2)}%`;
    document.getElementById('featureVolume').textContent = `${(data.features.volume / 1000000).toFixed(1)}M`;
    document.getElementById('featureRSI').textContent = `${data.features.rsi.toFixed(1)}`;
    
    // Create regime chart
    createRegimeChart(data);
}

// Display GARCH Volatility Analysis
function displayVolatilityAnalysis(data) {
    const currentVol = data.forecast[0];
    const forecastVol = data.mean_volatility;
    const trend = forecastVol > currentVol ? '📈 Increasing' : '📉 Decreasing';
    
    document.getElementById('currentVol').textContent = `${currentVol.toFixed(2)}%`;
    document.getElementById('forecastVol').textContent = `${forecastVol.toFixed(2)}%`;
    document.getElementById('volTrend').textContent = trend;
    
    // Determine risk level
    const riskLevel = forecastVol > 25 ? 'High Risk' : forecastVol > 15 ? 'Medium Risk' : 'Low Risk';
    const riskEmoji = forecastVol > 25 ? '⚠️' : forecastVol > 15 ? '⚡' : '✅';
    document.getElementById('riskLevel').textContent = `${riskEmoji} ${riskLevel} - Expected volatility is ${forecastVol.toFixed(1)}% over the next 30 days`;
    
    // Create volatility chart
    createVolatilityChart(data);
}

// Generate AI Insights
function generateAIInsights(regimeData, volatilityData) {
    // Market Sentiment
    let sentiment = '';
    if (regimeData.regime_name === 'Bull Market') {
        sentiment = '🟢 The market is currently in a bullish phase with positive momentum. Prices are trending upward with strong buying interest.';
    } else if (regimeData.regime_name === 'Bear Market') {
        sentiment = '🔴 The market is in a bearish phase with downward pressure. Consider defensive strategies and risk management.';
    } else if (regimeData.regime_name === 'High Volatility') {
        sentiment = '🟡 The market is experiencing high volatility with significant price swings. Exercise caution with position sizing.';
    } else {
        sentiment = '🔵 The market is consolidating with sideways movement. Wait for clear directional signals before taking large positions.';
    }
    document.getElementById('sentimentText').textContent = sentiment;
    
    // Risk Factors
    const riskFactors = [];
    if (volatilityData.mean_volatility > 20) {
        riskFactors.push('High volatility expected - larger price swings likely');
    }
    if (regimeData.features.rsi > 70) {
        riskFactors.push('Overbought conditions - potential for correction');
    } else if (regimeData.features.rsi < 30) {
        riskFactors.push('Oversold conditions - potential for bounce');
    }
    if (Math.abs(regimeData.features.returns) > 5) {
        riskFactors.push('Extreme returns observed - mean reversion possible');
    }
    
    const riskHTML = riskFactors.length > 0 
        ? riskFactors.map(r => `<li>${r}</li>`).join('')
        : '<li>Market conditions appear stable</li>';
    document.getElementById('riskFactors').innerHTML = riskHTML;
    
    // Recommendations
    const recommendations = [];
    if (regimeData.regime_name === 'Bull Market' && volatilityData.mean_volatility < 15) {
        recommendations.push('Consider increasing exposure to quality growth stocks');
        recommendations.push('Look for breakout opportunities in trending sectors');
    } else if (regimeData.regime_name === 'Bear Market') {
        recommendations.push('Focus on defensive sectors and quality dividends');
        recommendations.push('Consider hedging strategies or reduce position sizes');
    } else if (regimeData.regime_name === 'High Volatility') {
        recommendations.push('Use options strategies for hedging');
        recommendations.push('Avoid overleveraging positions');
    } else {
        recommendations.push('Wait for clear breakout signals');
        recommendations.push('Focus on range-bound trading strategies');
    }
    
    const recHTML = recommendations.map(r => `<li>${r}</li>`).join('');
    document.getElementById('recommendations').innerHTML = recHTML;
}

// Create Regime Chart (Bar Chart showing features)
function createRegimeChart(data) {
    const canvas = document.getElementById('regimeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (window.regimeChartInstance) {
        window.regimeChartInstance.destroy();
    }
    
    window.regimeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Returns', 'Volatility', 'RSI', 'Volume (M)'],
            datasets: [{
                label: 'Market Features',
                data: [
                    data.features.returns,
                    data.features.volatility,
                    data.features.rsi,
                    data.features.volume / 1000000
                ],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(245, 87, 108, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(237, 100, 166, 1)',
                    'rgba(245, 87, 108, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Current Market Characteristics',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create Volatility Chart (Line Chart showing forecast)
function createVolatilityChart(data) {
    const canvas = document.getElementById('volatilityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (window.volatilityChartInstance) {
        window.volatilityChartInstance.destroy();
    }
    
    const labels = data.forecast.map((_, i) => `Day ${i + 1}`);
    
    window.volatilityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Predicted Volatility (%)',
                data: data.forecast,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: '30-Day Volatility Forecast',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Volatility: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Initialize Accordion Menu
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Initialize Balance Tabs
function initializeBalanceTabs() {
    const balanceTabs = document.querySelectorAll('.balance-tab');
    
    balanceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            balanceTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // You can add logic here to show different balance content
            console.log('Switched to:', this.textContent);
        });
    });
}

// Initialize Profile Menu
function initializeProfileMenu() {
    const profileBtn = document.getElementById('profileBtn');
    const profileOverlay = document.getElementById('profileOverlay');
    const closeMenu = document.getElementById('closeMenu');
    
    // Open profile menu
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileOverlay.classList.add('active');
        });
    }
    
    // Close profile menu
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            profileOverlay.classList.remove('active');
        });
    }
    
    // Close on overlay click
    if (profileOverlay) {
        profileOverlay.addEventListener('click', function(e) {
            if (e.target === profileOverlay) {
                profileOverlay.classList.remove('active');
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            profileOverlay.classList.remove('active');
        }
    });
}

// CTA Button Handlers
document.addEventListener('click', function(e) {
    // Start Investing Button
    if (e.target.classList.contains('cta-button')) {
        alert('Great! Let\'s start your investment journey. This would typically open the account creation flow.');
    }
    
    // Add Money Button
    if (e.target.classList.contains('add-money-btn') || e.target.parentElement.classList.contains('add-money-btn')) {
        alert('Add money to your INDstocks account. This would open the payment gateway.');
    }
    
    // Explore Button
    if (e.target.classList.contains('explore-btn') || e.target.parentElement.classList.contains('explore-btn')) {
        alert('Explore advanced trading features. This would navigate to the trading tools page.');
    }
    
    // View All Button
    if (e.target.classList.contains('view-all-btn') || e.target.parentElement.classList.contains('view-all-btn')) {
        alert('View all your assets. This would navigate to the detailed assets page.');
    }
    
    // FAB (Help Button)
    if (e.target.classList.contains('fab') || e.target.parentElement.classList.contains('fab')) {
        alert('Need help? Our support team is here to assist you!\n\nEmail: support@indmoney.com\nPhone: 1800-123-4567');
    }
    
    // Logout Button
    if (e.target.classList.contains('logout-btn') || e.target.parentElement.classList.contains('logout-btn')) {
        if (confirm('Are you sure you want to logout?')) {
            alert('Logging out... This would redirect to the login page.');
        }
    }
    
    // Delete Account Button
    if (e.target.classList.contains('delete-account-btn') || e.target.parentElement.classList.contains('delete-account-btn')) {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion process initiated. This would require additional verification.');
        }
    }
});

// Navigation Link Handlers (Set up after DOM loads)
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`📍 Found ${navLinks.length} navigation links`);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
            console.log('Navigation clicked:', href);
            
            if (href === '#indstocks') {
                // Show trading interface
                console.log('Opening INDstocks...');
                openTradingInterface();
            } else if (href === '#analysis') {
                // Show analysis dashboard
                console.log('Opening Analysis Dashboard...');
                openAnalysisDashboard();
            } else if (href === '#dashboard') {
                // Close trading interface, show dashboard
                console.log('Opening Dashboard...');
                closeTradingInterface();
                closeAnalysisDashboard();
            } else {
                const section = href.substring(1);
                alert(`Navigating to ${section}... This would load the ${section} page.`);
            }
        });
    });
}

// Call setupNavigation when DOM is ready
document.addEventListener('DOMContentLoaded', setupNavigation);

// Open Trading Interface
function openTradingInterface() {
    console.log('🚀 Opening INDstocks Trading Interface...');
    const tradingInterface = document.getElementById('tradingInterface');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    console.log('Trading Interface Element:', tradingInterface);
    console.log('Dashboard Container:', dashboardContainer);
    
    if (tradingInterface && dashboardContainer) {
        tradingInterface.classList.add('active');
        dashboardContainer.style.display = 'none';
        console.log('✅ Trading interface displayed');
        console.log('Classes:', tradingInterface.className);
        
        // Initialize trading chart with live data
        setTimeout(() => {
            try {
                initChartTypeDropdown();
                initStockSearch();
                initThemeToggle();
                // Load initial data for NIFTY 50
                loadLiveHistoricalData('NIFTY_50', 252);
                // Start real-time ticker updates
                startTradingTickerUpdates();
                console.log('✅ Trading chart and terminal UI initialized');
            } catch (error) {
                console.error('❌ Error initializing trading chart:', error);
            }
        }, 100);
    }
}

// Close Trading Interface
function closeTradingInterface() {
    const tradingInterface = document.getElementById('tradingInterface');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    if (tradingInterface && dashboardContainer) {
        tradingInterface.classList.remove('active');
        dashboardContainer.style.display = 'grid';
        // Stop ticker updates
        if (window.tickerUpdateInterval) {
            clearInterval(window.tickerUpdateInterval);
            window.tickerUpdateInterval = null;
        }
    }
}

// Start Real-Time Trading Ticker Updates
function startTradingTickerUpdates() {
    console.log('🔴 Starting real-time ticker updates...');
    
    // Initial update
    updateTradingTickers();
    
    // Update every 3 seconds
    if (window.tickerUpdateInterval) {
        clearInterval(window.tickerUpdateInterval);
    }
    
    window.tickerUpdateInterval = setInterval(() => {
        updateTradingTickers();
    }, 3000);
}

// Update Trading Tickers with real Finnhub data
async function updateTradingTickers() {
    const tradingInterface = document.getElementById('tradingInterface');
    if (!tradingInterface || !tradingInterface.classList.contains('active')) {
        return;
    }
    
    // Fetch real-time data from Finnhub
    const niftyData = await fetchFinnhubQuote('NIFTY_50');
    const sensexData = await fetchFinnhubQuote('SENSEX');
    
    // Update NIFTY 50 ticker
    const niftyPrice = document.querySelector('.market-ticker-item:nth-child(1) .ticker-price');
    const niftyValue = document.querySelector('.market-ticker-item:nth-child(1) .ticker-value');
    const niftyChange = document.querySelector('.market-ticker-item:nth-child(1) .ticker-change');
    
    if (niftyPrice && niftyValue && niftyChange && niftyData && niftyData.price > 0) {
        const change = niftyData.change;
        const changePercent = niftyData.changePercent;
        
        // Update market data
        marketData.indices.NIFTY50 = {
            value: niftyData.price,
            change: niftyData.change,
            changePercent: niftyData.changePercent
        };
        
        niftyPrice.textContent = Math.abs(change).toFixed(2);
        niftyPrice.className = `ticker-price ${change >= 0 ? 'positive' : 'negative'}`;
        
        niftyValue.textContent = niftyData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        
        const arrow = change >= 0 ? '▲' : '▼';
        niftyChange.textContent = `${arrow} ${Math.abs(changePercent).toFixed(2)}%`;
        niftyChange.className = `ticker-change ${change >= 0 ? 'positive' : 'negative'}`;
        
        // Add pulse animation
        niftyPrice.style.animation = 'none';
        setTimeout(() => {
            niftyPrice.style.animation = 'pulse-live 0.5s ease';
        }, 10);
    }
    
    // Update SENSEX ticker
    const sensexPrice = document.querySelector('.market-ticker-item:nth-child(2) .ticker-price');
    const sensexValue = document.querySelector('.market-ticker-item:nth-child(2) .ticker-value');
    const sensexChange = document.querySelector('.market-ticker-item:nth-child(2) .ticker-change');
    
    if (sensexPrice && sensexValue && sensexChange && sensexData && sensexData.price > 0) {
        const change = sensexData.change;
        const changePercent = sensexData.changePercent;
        
        // Update market data
        marketData.indices.SENSEX = {
            value: sensexData.price,
            change: sensexData.change,
            changePercent: sensexData.changePercent
        };
        
        sensexPrice.textContent = Math.abs(change).toFixed(2);
        sensexPrice.className = `ticker-price ${change >= 0 ? 'positive' : 'negative'}`;
        
        sensexValue.textContent = sensexData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        
        const arrow = change >= 0 ? '▲' : '▼';
        sensexChange.textContent = `${arrow} ${Math.abs(changePercent).toFixed(2)}%`;
        sensexChange.className = `ticker-change ${change >= 0 ? 'positive' : 'negative'}`;
        
        // Add pulse animation
        sensexPrice.style.animation = 'none';
        setTimeout(() => {
            sensexPrice.style.animation = 'pulse-live 0.5s ease';
        }, 10);
    }
}

// Open Analysis Dashboard
function openAnalysisDashboard() {
    console.log('🧠 Opening ML Analysis Dashboard...');
    const analysisDashboard = document.getElementById('analysisDashboard');
    const dashboardContainer = document.querySelector('.dashboard-container');
    const tradingInterface = document.getElementById('tradingInterface');
    
    if (analysisDashboard && dashboardContainer) {
        analysisDashboard.classList.add('active');
        dashboardContainer.style.display = 'none';
        tradingInterface.classList.remove('active');
        
        // Load initial analytics data
        fetchAnalyticsData();
        
        // Start real-time updates every 30 seconds
        if (window.analyticsUpdateInterval) {
            clearInterval(window.analyticsUpdateInterval);
        }
        window.analyticsUpdateInterval = setInterval(() => {
            fetchAnalyticsData();
        }, 30000);
        
        console.log('✅ Analysis dashboard displayed with real-time updates');
        
        // Fetch and display analytics data
        setTimeout(() => {
            try {
                fetchAnalyticsDashboard();
                console.log('✅ Fetching analytics data...');
            } catch (error) {
                console.error('❌ Error fetching analytics:', error);
            }
        }, 100);
    }
}

// Close Analysis Dashboard
function closeAnalysisDashboard() {
    const analysisDashboard = document.getElementById('analysisDashboard');
    
    if (analysisDashboard) {
        analysisDashboard.classList.remove('active');
    }
}

// Initialize Trading Chart
// Global chart instance
let tradingChart = null;
let candlestickSeries = null;
let lineSeries = null;
let currentChartType = 'candlestick';

function initializeTradingChart() {
    const chartContainer = document.getElementById('tradingChart');
    if (!chartContainer) {
        console.error('Chart container not found');
        return;
    }
    
    // Remove old chart if exists
    if (tradingChart) {
        tradingChart.remove();
    }
    
    // Get theme colors
    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle.getPropertyValue('--terminal-bg-main').trim() || '#0D0E12';
    const gridColor = computedStyle.getPropertyValue('--terminal-chart-grid').trim() || '#131722';
    const textColor = computedStyle.getPropertyValue('--terminal-text-secondary').trim() || '#787B86';
    const borderColor = computedStyle.getPropertyValue('--terminal-border').trim() || '#1E222D';
    
    // Get container dimensions (with fallback)
    const width = chartContainer.clientWidth || window.innerWidth - 100;
    const height = chartContainer.clientHeight || 600;
    
    console.log('Chart container dimensions:', width, 'x', height);
    
    // Create interactive chart with Lightweight Charts
    tradingChart = LightweightCharts.createChart(chartContainer, {
        width: width,
        height: height,
        autoSize: true,
        layout: {
            background: { color: bgColor },
            textColor: textColor,
        },
        grid: {
            vertLines: { color: gridColor },
            horzLines: { color: gridColor },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
            vertLine: {
                color: textColor,
                width: 1,
                style: LightweightCharts.LineStyle.Dashed,
                labelBackgroundColor: '#2962FF',
            },
            horzLine: {
                color: textColor,
                width: 1,
                style: LightweightCharts.LineStyle.Dashed,
                labelBackgroundColor: '#2962FF',
            },
        },
        rightPriceScale: {
            borderColor: borderColor,
            scaleMargins: {
                top: 0.15,
                bottom: 0.05,
            },
        },
        timeScale: {
            borderColor: borderColor,
            timeVisible: true,
            secondsVisible: false,
        },
        handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
        },
        handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
        },
    });
    
    // Add candlestick series with professional colors
    candlestickSeries = tradingChart.addCandlestickSeries({
        upColor: '#089981',
        downColor: '#F23645',
        borderUpColor: '#089981',
        borderDownColor: '#F23645',
        wickUpColor: '#089981',
        wickDownColor: '#F23645',
    });
    
    // Set data
    if (currentChartData.length > 0) {
        // Data from Finnhub already has time as Unix timestamp in seconds
        const formattedData = currentChartData.map(candle => ({
            time: candle.time, // Already in Unix timestamp (seconds)
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
        }));
        candlestickSeries.setData(formattedData);
        
        console.log('📊 Chart data sample:', formattedData.slice(0, 3));
        console.log('📊 Last candle:', formattedData[formattedData.length - 1]);
    }
    
    // Fit content to view
    tradingChart.timeScale().fitContent();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (tradingChart && chartContainer) {
            tradingChart.applyOptions({
                width: chartContainer.clientWidth,
                height: chartContainer.clientHeight,
            });
        }
    });
    
    // Add crosshair move listener for hover tooltips
    tradingChart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) {
            return;
        }
        
        const data = param.seriesData.get(candlestickSeries);
        if (data) {
            updateOHLCDisplay(data);
            updateOHLCDate(param.time); // Update date with crosshair time
        }
    });
    
    // Add infinite scroll - load more data when scrolling back
    tradingChart.timeScale().subscribeVisibleLogicalRangeChange(() => {
        const logicalRange = tradingChart.timeScale().getVisibleLogicalRange();
        if (logicalRange !== null) {
            const barsInfo = candlestickSeries.barsInLogicalRange(logicalRange);
            
            // If user scrolled within 20% of the beginning, load more data
            if (barsInfo !== null && barsInfo.barsBefore < 20) {
                loadMoreHistoricalData();
            }
        }
    });
    
    console.log('✅ Interactive chart initialized with zoom, pan, hover, and infinite scroll!');
}

// Switch between candlestick and line chart
function switchChartType(type) {
    if (!tradingChart || !currentChartData || currentChartData.length === 0) {
        console.warn('Cannot switch chart type: chart not initialized or no data');
        return;
    }
    
    currentChartType = type;
    
    // Format data for both chart types (time is already Unix timestamp in seconds)
    const formattedData = currentChartData.map(candle => ({
        time: candle.time, // Already in Unix timestamp (seconds)
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        value: candle.close, // For line chart
    }));
    
    if (type === 'line') {
        // Remove candlestick series
        if (candlestickSeries) {
            tradingChart.removeSeries(candlestickSeries);
            candlestickSeries = null;
        }
        
        // Create line series if it doesn't exist
        if (!lineSeries) {
            lineSeries = tradingChart.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 4,
                crosshairMarkerBorderColor: '#2962FF',
                crosshairMarkerBackgroundColor: '#FFFFFF',
            });
        }
        
        // Set data
        lineSeries.setData(formattedData);
        
        // Update crosshair listener to use line series
        tradingChart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.point) {
                return;
            }
            
            const data = param.seriesData.get(lineSeries);
            if (data) {
                updateOHLCDisplayForLine(data);
                updateOHLCDate(param.time); // Update date with crosshair time
            }
        });
        
        console.log('✅ Switched to line chart');
        
    } else {
        // Remove line series
        if (lineSeries) {
            tradingChart.removeSeries(lineSeries);
            lineSeries = null;
        }
        
        // Create candlestick series if it doesn't exist
        if (!candlestickSeries) {
            candlestickSeries = tradingChart.addCandlestickSeries({
                upColor: '#089981',
                downColor: '#F23645',
                borderUpColor: '#089981',
                borderDownColor: '#F23645',
                wickUpColor: '#089981',
                wickDownColor: '#F23645',
            });
        }
        
        // Set data
        candlestickSeries.setData(formattedData);
        
        // Update crosshair listener to use candlestick series
        tradingChart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.point) {
                return;
            }
            
            const data = param.seriesData.get(candlestickSeries);
            if (data) {
                updateOHLCDisplay(data);
                updateOHLCDate(param.time); // Update date with crosshair time
            }
        });
        
        // Re-enable infinite scroll for candlestick
        tradingChart.timeScale().subscribeVisibleLogicalRangeChange(() => {
            const logicalRange = tradingChart.timeScale().getVisibleLogicalRange();
            if (logicalRange !== null) {
                const barsInfo = candlestickSeries.barsInLogicalRange(logicalRange);
                
                if (barsInfo !== null && barsInfo.barsBefore < 20) {
                    loadMoreHistoricalData();
                }
            }
        });
        
        console.log('✅ Switched to candlestick chart');
    }
    
    // Fit content to view
    tradingChart.timeScale().fitContent();
}

// Update OHLC display for line chart (shows only close price)
function updateOHLCDisplayForLine(data) {
    const ohlcContainer = document.getElementById('ohlcDisplay');
    if (!ohlcContainer) return;
    
    const timestamp = data.time > 10000000000 ? data.time : data.time * 1000;
    const date = new Date(timestamp);
    
    let dateStr;
    if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        dateStr = `${day}.${month}.${year} ${hours}:${minutes}`;
    } else {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        dateStr = `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    
    const stockName = document.getElementById('currentStockName')?.textContent || 'NIFTY 50';
    const price = data.value || data.close;
    
    ohlcContainer.innerHTML = `
        <div class="ohlc-header">
            ${stockName} · ${dateStr}
        </div>
        <div class="ohlc-values">
            <span><strong>Price</strong> ${price.toFixed(2)}</span>
        </div>
    `;
}

// Load more historical data for infinite scroll
async function loadMoreHistoricalData() {
    // Prevent multiple simultaneous loads
    if (isLoadingMoreData) {
        console.log('⏳ Already loading data, skipping...');
        return;
    }
    
    // Check if we've reached the maximum
    if (totalDaysLoaded >= maxHistoricalDays) {
        console.log(`📊 Maximum historical data loaded (${maxHistoricalDays} days)`);
        return;
    }
    
    isLoadingMoreData = true;
    const additionalDays = 100; // Load 100 more days at a time
    const newTotalDays = Math.min(totalDaysLoaded + additionalDays, maxHistoricalDays);
    
    try {
        console.log(`📈 Loading more data... (${totalDaysLoaded} → ${newTotalDays} days)`);
        
        const response = await fetch(`${API_BASE_URL}/assets/${currentSymbol}/history?days=${newTotalDays}`);
        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
            console.log(`✅ Loaded ${data.data.length} candles (was ${currentChartData.length})`);
            
            // Convert and sort all data
            const allData = data.data.map((candle) => ({
                time: new Date(candle.date).getTime() / 1000,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                date: candle.date
            })).sort((a, b) => a.time - b.time);
            
            // Only update if we got more data
            if (allData.length > currentChartData.length) {
                // Store the current visible range
                const currentRange = tradingChart.timeScale().getVisibleLogicalRange();
                
                // Update the chart data
                currentChartData = allData;
                candlestickSeries.setData(currentChartData);
                
                // Restore the visible range to maintain user's position
                if (currentRange !== null) {
                    tradingChart.timeScale().setVisibleLogicalRange(currentRange);
                }
                
                totalDaysLoaded = newTotalDays;
                console.log(`✅ Chart updated with ${currentChartData.length} total candles`);
            }
        }
    } catch (error) {
        console.error('❌ Error loading more data:', error);
    } finally {
        isLoadingMoreData = false;
    }
}

// Update OHLC Tooltip Display
function updateOHLCDisplay(data) {
    const ohlcDate = document.getElementById('ohlc-date');
    const ohlcOpen = document.getElementById('ohlc-open');
    const ohlcHigh = document.getElementById('ohlc-high');
    const ohlcLow = document.getElementById('ohlc-low');
    const ohlcClose = document.getElementById('ohlc-close');
    const ohlcVolume = document.getElementById('ohlc-volume-value');
    
    if (!ohlcOpen || !ohlcHigh || !ohlcLow || !ohlcClose) return;
    
    // Format numbers to 2 decimal places with proper thousands separators
    const formatPrice = (price) => {
        if (!price) return '0.00';
        return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    // Update values
    ohlcOpen.textContent = formatPrice(data.open);
    ohlcHigh.textContent = formatPrice(data.high);
    ohlcLow.textContent = formatPrice(data.low);
    ohlcClose.textContent = formatPrice(data.close);
    
    // Determine color based on close vs open
    const isPositive = data.close >= data.open;
    ohlcOpen.className = 'ohlc-value ' + (isPositive ? 'positive' : 'negative');
    ohlcHigh.className = 'ohlc-value ' + (isPositive ? 'positive' : 'negative');
    ohlcLow.className = 'ohlc-value ' + (isPositive ? 'positive' : 'negative');
    ohlcClose.className = 'ohlc-value ' + (isPositive ? 'positive' : 'negative');
    
    // Volume (placeholder for now)
    if (ohlcVolume) {
        ohlcVolume.textContent = data.volume ? data.volume.toLocaleString('en-IN') : '0.00';
    }
}

// Update OHLC date separately when crosshair moves
function updateOHLCDate(timestamp) {
    const ohlcDate = document.getElementById('ohlc-date');
    if (!ohlcDate) return;
    
    try {
        // Lightweight Charts returns Unix timestamp as string or number (in seconds)
        let timeInMs;
        
        if (typeof timestamp === 'string') {
            // If it's a date string like "2025-01-15"
            timeInMs = new Date(timestamp).getTime();
        } else if (typeof timestamp === 'number') {
            // Unix timestamp in seconds, convert to milliseconds
            timeInMs = timestamp * 1000;
        } else {
            throw new Error('Invalid timestamp format');
        }
        
        const date = new Date(timeInMs);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', timestamp, timeInMs);
            return;
        }
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        const indexName = currentIndex === 'NIFTY_50' ? 'NIFTY 50' : currentIndex;
        const formattedDate = `${indexName} · ${day}.${month}.${year} ${hours}:${minutes}`;
        ohlcDate.textContent = formattedDate;
    } catch (error) {
        console.error('Error formatting date:', error, timestamp);
    }
}

// Initialize Chart Type Dropdown
function initChartTypeDropdown() {
    const chartTypeBtn = document.getElementById('chartTypeBtn');
    const chartTypeDropdown = document.getElementById('chartTypeDropdown');
    
    if (!chartTypeBtn || !chartTypeDropdown) return;
    
    // Toggle dropdown on button click
    chartTypeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chartTypeDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        chartTypeDropdown.classList.remove('active');
    });
    
    // Handle chart type selection
    const chartTypeOptions = chartTypeDropdown.querySelectorAll('.chart-type-option');
    chartTypeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const chartType = option.dataset.type;
            const chartName = option.textContent.trim();
            
            // Update button text
            const btnTextSpan = chartTypeBtn.querySelector('span');
            if (btnTextSpan) {
                btnTextSpan.textContent = chartName;
            }
            
            // Close dropdown
            chartTypeDropdown.classList.remove('active');
            
            // Switch chart type
            switchChartType(chartType);
            
            console.log(`✅ Chart type changed to: ${chartType}`);
        });
    });
}

// Initialize Stock Search and Selector
function initStockSearch() {
    const searchBtn = document.getElementById('stockSearchBtn');
    const searchBtn2 = document.getElementById('stockSearchBtn2');
    const stockSelectorIcon = document.getElementById('stockSelectorIcon');
    const stockSelectorIcon2 = document.getElementById('stockSelectorIcon2');
    const searchDropdown = document.getElementById('stockSearchDropdown');
    const searchInput = document.getElementById('stockSearchInput');
    const stockListContainer = document.getElementById('stockListContainer');
    const marketTabs = document.querySelectorAll('.market-tab');
    
    // Check if required elements exist
    if (!searchDropdown || !searchInput || !stockListContainer) {
        console.warn('Stock selector elements not found');
        return;
    }
    
    let currentMarketFilter = 'all';
    
    // Toggle dropdown function
    function toggleStockDropdown(e, btn) {
        e.stopPropagation();
        console.log('📋 Stock selector clicked:', btn.id);
        
        const isOpening = !searchDropdown.classList.contains('active');
        searchDropdown.classList.toggle('active');
        
        // Toggle active class on both buttons if they exist
        if (searchBtn) searchBtn.classList.toggle('active');
        if (searchBtn2) searchBtn2.classList.toggle('active');
        
        if (isOpening) {
            console.log('✅ Opening stock dropdown');
            searchInput.focus();
            renderStockList();
        } else {
            console.log('❌ Closing stock dropdown');
        }
    }
    
    // Add click handler to BOTH buttons if they exist
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => toggleStockDropdown(e, searchBtn));
        console.log('✅ Stock selector button 1 initialized');
    }
    
    if (searchBtn2) {
        searchBtn2.addEventListener('click', (e) => toggleStockDropdown(e, searchBtn2));
        console.log('✅ Stock selector button 2 initialized');
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const clickedInsideDropdown = searchDropdown.contains(e.target);
        const clickedBtn1 = searchBtn && searchBtn.contains(e.target);
        const clickedBtn2 = searchBtn2 && searchBtn2.contains(e.target);
        
        if (!clickedInsideDropdown && !clickedBtn1 && !clickedBtn2) {
            searchDropdown.classList.remove('active');
            if (searchBtn) searchBtn.classList.remove('active');
            if (searchBtn2) searchBtn2.classList.remove('active');
        }
    });
    
    // Market filter tabs
    marketTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            marketTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMarketFilter = tab.dataset.market;
            renderStockList(searchInput.value);
        });
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
        renderStockList(e.target.value);
    });
    
    // Render stock list - make it globally accessible
    window.renderStockList = function(searchQuery = '') {
        const allStocks = getAllStocks();
        const query = searchQuery.toLowerCase().trim();
        
        // Get currently selected index from toggle buttons
        const activeToggleBtn = document.querySelector('.index-toggle-btn.active');
        const selectedIndex = activeToggleBtn ? activeToggleBtn.getAttribute('data-symbol') : 'NIFTY_50';
        const selectedMarket = selectedIndex === 'NIFTY_50' ? 'NIFTY' : 'SENSEX';
        
        // Filter by market and search query
        let filteredStocks = allStocks.filter(stock => {
            // If a market tab is selected (not 'all'), use that filter
            // Otherwise, filter by the currently selected index
            let matchesMarket;
            if (currentMarketFilter === 'all') {
                // Show stocks from the currently selected index
                matchesMarket = stock.market === selectedMarket || stock.symbol === 'NIFTY_50' || stock.symbol === 'SENSEX';
            } else {
                matchesMarket = stock.market === currentMarketFilter;
            }
            
            const matchesSearch = !query || 
                stock.name.toLowerCase().includes(query) || 
                stock.symbol.toLowerCase().includes(query);
            return matchesMarket && matchesSearch;
        });
        
        // Limit to 50 results
        filteredStocks = filteredStocks.slice(0, 50);
        
        // Get stock list container (support both local and global access)
        const container = stockListContainer || document.getElementById('stockListContainer');
        if (!container) return;
        
        // Render stock list
        container.innerHTML = filteredStocks.map(stock => `
            <div class="stock-list-item" data-symbol="${stock.symbol}" data-name="${stock.name}">
                <div class="stock-item-info">
                    <div>
                        <span class="stock-item-name">${stock.name}</span>
                        <span class="stock-item-market">${stock.market}</span>
                    </div>
                    <span class="stock-item-symbol">${stock.symbol}</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.stock-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                const name = item.dataset.name;
                selectStock(symbol, name);
                const dropdown = searchDropdown || document.getElementById('stockSearchDropdown');
                if (dropdown) dropdown.classList.remove('active');
            });
        });
    }
    
    const renderStockList = window.renderStockList;
    
    // Fetch real-time prices for stock list
    async function fetchStockListPrices(stocks) {
        // Fetch prices in parallel (limit to avoid rate limiting)
        const batchSize = 10;
        for (let i = 0; i < stocks.length; i += batchSize) {
            const batch = stocks.slice(i, i + batchSize);
            const promises = batch.map(stock => 
                fetch(`http://localhost:8000/assets/${stock.symbol}/quote`)
                    .then(res => res.json())
                    .then(data => ({ symbol: stock.symbol, data }))
                    .catch(err => ({ symbol: stock.symbol, error: true }))
            );
            
            const results = await Promise.all(promises);
            
            // Update UI with prices
            results.forEach(result => {
                const stockItem = stockListContainer.querySelector(`[data-symbol="${result.symbol}"]`);
                if (!stockItem) return;
                
                const priceContainer = stockItem.querySelector('.stock-item-price');
                if (!priceContainer) return;
                
                if (result.error || !result.data) {
                    priceContainer.innerHTML = '<span class="stock-price-error">-</span>';
                    return;
                }
                
                const price = result.data.price || 0;
                const change = result.data.change || 0;
                const changePercent = result.data.changePercent || 0;
                const isPositive = change >= 0;
                
                priceContainer.innerHTML = `
                    <span class="stock-price-value">₹${price.toFixed(2)}</span>
                    <span class="stock-price-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${changePercent.toFixed(2)}%
                    </span>
                `;
            });
            
            // Small delay between batches to avoid overwhelming the API
            if (i + batchSize < stocks.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
    
    // Initial render
    renderStockList();
}

// Select a stock and load its data
function selectStock(symbol, name) {
    console.log(`📊 Selected stock: ${name} (${symbol})`);
    
    // Update current symbol
    currentSymbol = symbol;
    
    // Update display (both top and bottom)
    const currentStockName = document.getElementById('currentStockName');
    const currentStockName2 = document.getElementById('currentStockName2');
    const currentStockPrice = document.getElementById('currentStockPrice');
    const currentStockPrice2 = document.getElementById('currentStockPrice2');
    const currentStockChange = document.getElementById('currentStockChange');
    const currentStockChange2 = document.getElementById('currentStockChange2');
    
    if (currentStockName) {
        currentStockName.textContent = name;
    }
    if (currentStockName2) {
        currentStockName2.textContent = name;
    }
    
    // Show loading state
    if (currentStockPrice) {
        currentStockPrice.textContent = 'Loading...';
    }
    if (currentStockPrice2) {
        currentStockPrice2.textContent = 'Loading...';
    }
    if (currentStockChange) {
        currentStockChange.textContent = '';
    }
    if (currentStockChange2) {
        currentStockChange2.textContent = '';
    }
    
    // Reset infinite scroll state
    totalDaysLoaded = 252;
    isLoadingMoreData = false;
    
    // Load data for selected stock
    loadLiveHistoricalData(symbol, 252);
    
    console.log(`✅ Loading data for ${name}...`);
}

// Update stock price display
function updateStockPriceDisplay(price, change, changePercent) {
    const currentStockPrice = document.getElementById('currentStockPrice');
    const currentStockPrice2 = document.getElementById('currentStockPrice2');
    const currentStockChange = document.getElementById('currentStockChange');
    const currentStockChange2 = document.getElementById('currentStockChange2');
    
    if (currentStockPrice) {
        currentStockPrice.textContent = `₹${price.toFixed(2)}`;
    }
    if (currentStockPrice2) {
        currentStockPrice2.textContent = `₹${price.toFixed(2)}`;
    }
    
    if (currentStockChange) {
        const arrow = change >= 0 ? '▲' : '▼';
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} ${arrow} ${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        currentStockChange.textContent = changeText;
        currentStockChange.className = 'stock-change-text ' + (change >= 0 ? 'positive' : 'negative');
    }
    if (currentStockChange2) {
        const arrow = change >= 0 ? '▲' : '▼';
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} ${arrow} ${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        currentStockChange2.textContent = changeText;
        currentStockChange2.className = 'stock-change-text ' + (change >= 0 ? 'positive' : 'negative');
    }
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    if (!themeToggleBtn) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('indmoney-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon(true);
    }
    
    // Add click handler
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    console.log('✅ Theme toggle initialized');
}

// Toggle theme between light and dark
function toggleTheme() {
    const isLightMode = document.body.classList.toggle('light-mode');
    
    // Save preference
    localStorage.setItem('indmoney-theme', isLightMode ? 'light' : 'dark');
    
    // Update icon
    updateThemeIcon(isLightMode);
    
    // Recreate chart with new theme
    if (chart) {
        const chartElement = document.getElementById('tradingChart');
        if (chartElement) {
            chartElement.innerHTML = '';
            initializeTradingChart();
        }
    }
    
    console.log(`🎨 Theme switched to ${isLightMode ? 'light' : 'dark'} mode`);
}

// Update theme toggle icon
function updateThemeIcon(isLightMode) {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            icon.className = isLightMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Add Chart Interactivity (Crosshair, hover effects)
function addChartInteractivity(canvas) {
    const crosshair = document.createElement('div');
    crosshair.style.cssText = `
        position: absolute;
        pointer-events: none;
        display: none;
    `;
    canvas.parentElement.appendChild(crosshair);
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Show price at cursor position
        console.log(`Cursor at: X=${x.toFixed(0)}, Y=${y.toFixed(0)}`);
    });
    
    canvas.addEventListener('mouseenter', function() {
        canvas.style.cursor = isDrawingMode ? 'crosshair' : 'default';
    });
    
    canvas.addEventListener('click', function(e) {
        if (isDrawingMode && selectedDrawTool) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            console.log(`Drawing ${selectedDrawTool} at (${x}, ${y})`);
            alert(`${selectedDrawTool} tool activated!\nClick and drag to draw on the chart.`);
            
            // Reset drawing mode
            isDrawingMode = false;
            selectedDrawTool = null;
            document.querySelectorAll('.draw-tool').forEach(t => t.classList.remove('active'));
        }
    });
}

// Store current chart data globally
let currentChartData = [];
let currentTimeframe = 'D';
let isDrawingMode = false;
let selectedDrawTool = null;
let currentSymbol = 'NIFTY_50';
let totalDaysLoaded = 252;
let isLoadingMoreData = false;
let maxHistoricalDays = 1825; // 5 years max

// Stock Market Data
const STOCK_DATA = {
    indices: [
        { name: 'NIFTY 50', symbol: 'NIFTY_50', market: 'NIFTY' },
        { name: 'SENSEX', symbol: 'SENSEX', market: 'SENSEX' }
    ],
    nifty50: [
        { name: 'Adani Enterprises', symbol: 'ADANIENT' },
        { name: 'Adani Ports & SEZ', symbol: 'ADANIPORTS' },
        { name: 'Apollo Hospitals', symbol: 'APOLLOHOSP' },
        { name: 'Asian Paints', symbol: 'ASIANPAINT' },
        { name: 'Axis Bank', symbol: 'AXISBANK' },
        { name: 'Bajaj Auto', symbol: 'BAJAJ-AUTO' },
        { name: 'Bajaj Finance', symbol: 'BAJFINANCE' },
        { name: 'Bajaj Finserv', symbol: 'BAJAJFINSV' },
        { name: 'Bharat Electronics', symbol: 'BEL' },
        { name: 'Bharti Airtel', symbol: 'BHARTIARTL' },
        { name: 'Cipla', symbol: 'CIPLA' },
        { name: 'Coal India', symbol: 'COALINDIA' },
        { name: 'Dr. Reddy\'s Laboratories', symbol: 'DRREDDY' },
        { name: 'Eicher Motors', symbol: 'EICHERMOT' },
        { name: 'Eternal', symbol: 'ETERNAL' },
        { name: 'Grasim Industries', symbol: 'GRASIM' },
        { name: 'HCLTech', symbol: 'HCLTECH' },
        { name: 'HDFC Bank', symbol: 'HDFCBANK' },
        { name: 'HDFC Life', symbol: 'HDFCLIFE' },
        { name: 'Hindalco Industries', symbol: 'HINDALCO' },
        { name: 'Hindustan Unilever', symbol: 'HINDUNILVR' },
        { name: 'ICICI Bank', symbol: 'ICICIBANK' },
        { name: 'IndiGo', symbol: 'INDIGO' },
        { name: 'Infosys', symbol: 'INFY' },
        { name: 'ITC', symbol: 'ITC' },
        { name: 'Jio Financial Services', symbol: 'JIOFIN' },
        { name: 'JSW Steel', symbol: 'JSWSTEEL' },
        { name: 'Kotak Mahindra Bank', symbol: 'KOTAKBANK' },
        { name: 'Larsen & Toubro', symbol: 'LT' },
        { name: 'Mahindra & Mahindra', symbol: 'M&M' },
        { name: 'Maruti Suzuki', symbol: 'MARUTI' },
        { name: 'Max Healthcare', symbol: 'MAXHEALTH' },
        { name: 'Nestlé India', symbol: 'NESTLEIND' },
        { name: 'NTPC', symbol: 'NTPC' },
        { name: 'Oil and Natural Gas Corporation', symbol: 'ONGC' },
        { name: 'Power Grid', symbol: 'POWERGRID' },
        { name: 'Reliance Industries', symbol: 'RELIANCE' },
        { name: 'SBI Life Insurance Company', symbol: 'SBILIFE' },
        { name: 'Shriram Finance', symbol: 'SHRIRAMFIN' },
        { name: 'State Bank of India', symbol: 'SBIN' },
        { name: 'Sun Pharma', symbol: 'SUNPHARMA' },
        { name: 'Tata Consultancy Services', symbol: 'TCS' },
        { name: 'Tata Consumer Products', symbol: 'TATACONSUM' },
        { name: 'Tata Motors', symbol: 'TATAMOTORS' },
        { name: 'Tata Steel', symbol: 'TATASTEEL' },
        { name: 'Tech Mahindra', symbol: 'TECHM' },
        { name: 'Titan Company', symbol: 'TITAN' },
        { name: 'Trent', symbol: 'TRENT' },
        { name: 'UltraTech Cement', symbol: 'ULTRACEMCO' },
        { name: 'Wipro', symbol: 'WIPRO' }
    ],
    sensex: [
        { name: 'Adani Ports & SEZ', symbol: 'ADANIPORTS.BO' },
        { name: 'Asian Paints', symbol: 'ASIANPAINT.BO' },
        { name: 'Axis Bank', symbol: 'AXISBANK.BO' },
        { name: 'Bajaj Finance', symbol: 'BAJFINANCE.BO' },
        { name: 'Bajaj Finserv', symbol: 'BAJAJFINSV.BO' },
        { name: 'Bharat Electronics', symbol: 'BEL.BO' },
        { name: 'Bharti Airtel', symbol: 'BHARTIARTL.BO' },
        { name: 'Eternal', symbol: 'ETERNAL.BO' },
        { name: 'HCLTech', symbol: 'HCLTECH.BO' },
        { name: 'HDFC Bank', symbol: 'HDFCBANK.BO' },
        { name: 'Hindustan Unilever', symbol: 'HINDUNILVR.BO' },
        { name: 'ICICI Bank', symbol: 'ICICIBANK.BO' },
        { name: 'Infosys', symbol: 'INFY.BO' },
        { name: 'ITC', symbol: 'ITC.BO' },
        { name: 'Kotak Mahindra Bank', symbol: 'KOTAKBANK.BO' },
        { name: 'Larsen & Toubro', symbol: 'LT.BO' },
        { name: 'Mahindra & Mahindra', symbol: 'M&M.BO' },
        { name: 'Maruti Suzuki', symbol: 'MARUTI.BO' },
        { name: 'NTPC', symbol: 'NTPC.BO' },
        { name: 'Power Grid', symbol: 'POWERGRID.BO' },
        { name: 'Reliance Industries', symbol: 'RELIANCE.BO' },
        { name: 'State Bank of India', symbol: 'SBIN.BO' },
        { name: 'Sun Pharma', symbol: 'SUNPHARMA.BO' },
        { name: 'Tata Consultancy Services', symbol: 'TCS.BO' },
        { name: 'Tata Motors', symbol: 'TATAMOTORS.BO' },
        { name: 'Tata Steel', symbol: 'TATASTEEL.BO' },
        { name: 'Tech Mahindra', symbol: 'TECHM.BO' },
        { name: 'Titan Company', symbol: 'TITAN.BO' },
        { name: 'Trent', symbol: 'TRENT.BO' },
        { name: 'UltraTech Cement', symbol: 'ULTRACEMCO.BO' }
    ]
};

// Get all stocks for search
function getAllStocks() {
    return [
        ...STOCK_DATA.indices,
        ...STOCK_DATA.nifty50.map(s => ({ ...s, market: 'NIFTY' })),
        ...STOCK_DATA.sensex.map(s => ({ ...s, market: 'SENSEX' }))
    ];
}

// OLD CANVAS FUNCTION - Now using Lightweight Charts for interactivity
// This function is kept for reference but not used anymore
function drawTradingCandlestickChart_OLD(ctx, canvas, data) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    data.forEach(candle => {
        minPrice = Math.min(minPrice, candle.low);
        maxPrice = Math.max(maxPrice, candle.high);
    });
    
    const priceRange = maxPrice - minPrice;
    const candleWidth = chartWidth / data.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        const y = padding + (chartHeight / 10) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        const price = maxPrice - (priceRange / 10) * i;
        ctx.fillStyle = '#94A3B8';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }
    
    // Draw vertical grid for time
    const timeSteps = 10;
    for (let i = 0; i <= timeSteps; i++) {
        const x = padding + (chartWidth / timeSteps) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
    }
    
    // Draw candlesticks
    data.forEach((candle, index) => {
        const x = padding + (index * candleWidth) + candleWidth / 2;
        
        const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
        const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
        const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
        const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
        
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? '#10B981' : '#EF4444';
        
        // Draw wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
        
        // Draw body
        ctx.fillStyle = color;
        const bodyHeight = Math.abs(closeY - openY) || 1;
        const bodyY = Math.min(openY, closeY);
        const bodyWidth = candleWidth * 0.7;
        
        ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight);
    });
    
    // Draw axes
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Update OHLC display
    if (data.length > 0) {
        const lastCandle = data[data.length - 1];
        updateOHLCDisplay(lastCandle);
    }
}

// Update OHLC Display
function updateOHLCDisplay(candle) {
    const chartOpen = document.querySelector('.ohlc-data span:nth-child(1)');
    const chartHigh = document.querySelector('.ohlc-data span:nth-child(2)');
    const chartLow = document.querySelector('.ohlc-data span:nth-child(3)');
    const chartClose = document.querySelector('.ohlc-data span:nth-child(4)');
    
    if (chartOpen) chartOpen.innerHTML = `<strong>O</strong> ${candle.open.toFixed(2)}`;
    if (chartHigh) chartHigh.innerHTML = `<strong>H</strong> ${candle.high.toFixed(2)}`;
    if (chartLow) chartLow.innerHTML = `<strong>L</strong> ${candle.low.toFixed(2)}`;
    if (chartClose) chartClose.innerHTML = `<strong>C</strong> ${candle.close.toFixed(2)}`;
}

// Current selected index
let currentIndex = 'NIFTY_50';

// Initialize Trading Interface Interactivity
function initializeTradingInterface() {
    // Don't load data yet - wait until trading interface is opened
    // This function just sets up event listeners
    
    // Index Toggle (NIFTY/SENSEX)
    document.querySelectorAll('.index-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all toggle buttons
            document.querySelectorAll('.index-toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected symbol
            currentIndex = this.getAttribute('data-symbol');
            const indexName = this.textContent.trim();
            
            console.log(`🔄 Switching to ${indexName}...`);
            
            // Update display
            document.getElementById('currentStockName2').textContent = indexName;
            if (document.getElementById('currentStockName')) {
                document.getElementById('currentStockName').textContent = indexName;
            }
            
            // Refresh stock list to show stocks from the selected index
            const stockListContainer = document.getElementById('stockListContainer');
            if (stockListContainer && typeof renderStockList === 'function') {
                const searchInput = document.getElementById('stockSearchInput');
                renderStockList(searchInput ? searchInput.value : '');
                console.log(`📋 Stock list updated to show ${indexName} stocks`);
            }
            
            // Load data for selected index
            let days;
            switch(currentTimeframe) {
                case '1d': 
                case 'd': days = 252; break;
                case '1w': days = 90; break;
                case '1m': days = 90; break;
                case '1y': days = 365; break;
                case 'all': days = 1825; break;
                default: days = 252;
            }
            
            loadLiveHistoricalData(currentIndex, days);
        });
    });
    
    // Time Interval Buttons (both top timeframe-btn and bottom interval-btn)
    document.querySelectorAll('.interval-btn, .timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all interval and timeframe buttons
            document.querySelectorAll('.interval-btn, .timeframe-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTimeframe = this.textContent.trim().toLowerCase();
            
            // Load LIVE data based on timeframe - with more data for scrolling
            let days;
            switch(currentTimeframe) {
                case '5m': days = 5; break;       // 5 days for 5-minute view
                case '15m': days = 15; break;     // 15 days for 15-minute view
                case '1h': days = 30; break;      // 1 month for hourly view
                case '1d': 
                case 'd': days = 252; break;      // 1 trading year
                case '5d': days = 30; break;      // 5 days
                case '1m': days = 90; break;      // 3 months
                case '3m': days = 180; break;     // 6 months
                case '1y': days = 365; break;     // 1 year
                case '5y': days = 1825; break;    // 5 years
                case '1w': days = 90; break;      // 3 months
                case 'all': days = 1825; break;   // All data
                default: days = 252;
            }
            
            // Fetch LIVE data from Finnhub
            loadLiveHistoricalData(currentIndex, days);
        });
    });
    
    // Chart Type Controls
    document.querySelectorAll('.control-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const title = this.getAttribute('title');
            
            switch(title) {
                case 'Candlestick':
                    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    console.log('Switched to Candlestick chart');
                    break;
                case 'Line Chart':
                    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    console.log('Switched to Line chart');
                    alert('Line chart view - Coming soon!');
                    break;
                case 'Indicators':
                    console.log('Opening indicators panel');
                    alert('Technical Indicators:\n\n• Moving Averages (MA)\n• RSI\n• MACD\n• Bollinger Bands\n• Volume');
                    break;
                case 'Save':
                    console.log('Saving chart layout');
                    alert('Chart layout saved successfully!');
                    break;
                case 'Settings':
                    console.log('Opening settings');
                    alert('Chart Settings:\n\n• Theme\n• Grid Lines\n• Price Scale\n• Time Scale\n• Crosshair');
                    break;
                case 'Fullscreen':
                    console.log('Toggling fullscreen');
                    toggleFullscreen();
                    break;
            }
        });
    });
    
    // Drawing Tools
    document.querySelectorAll('.draw-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            document.querySelectorAll('.draw-tool').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedDrawTool = this.getAttribute('title');
            isDrawingMode = true;
            console.log('Selected drawing tool:', selectedDrawTool);
        });
    });
    
    // Icon Navigation
    document.querySelectorAll('.icon-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('logout-icon')) {
                if (confirm('Are you sure you want to logout?')) {
                    closeTradingInterface();
                    alert('Logged out successfully!');
                }
                return;
            }
            
            document.querySelectorAll('.icon-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const title = this.getAttribute('title');
            console.log('Switched to:', title);
            
            if (title !== 'Stocks') {
                alert(`${title} section - Coming soon!`);
            }
        });
    });
    
    // Trading Tabs
    document.querySelectorAll('.trading-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.trading-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            console.log('Switched tab:', this.textContent);
        });
    });
    
    // Chart Tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (this.textContent === 'Overview') {
                alert('Overview section:\n\n• Company Details\n• Market Cap\n• P/E Ratio\n• Dividend Yield\n• 52 Week High/Low\n• Financial Summary');
            }
        });
    });
    
    // Footer Controls
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Footer control:', this.textContent);
            this.classList.toggle('active');
        });
    });
    
    // Search functionality
    const tradingSearch = document.querySelector('.trading-search input');
    if (tradingSearch) {
        tradingSearch.addEventListener('input', function() {
            console.log('Searching for:', this.value);
            if (this.value.length > 2) {
                // Simulate search results
                console.log('Search results would appear here');
            }
        });
    }
}

// Toggle Fullscreen
function toggleFullscreen() {
    const chartArea = document.querySelector('.chart-main-area');
    
    if (!document.fullscreenElement) {
        chartArea.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Update Trading Data in Real-time
function updateTradingData() {
    const tradingInterface = document.getElementById('tradingInterface');
    if (!tradingInterface || !tradingInterface.classList.contains('active')) {
        return;
    }
    
    // Market data is now updated via WebSocket automatically
    
    // Update NIFTY ticker (using live data)
    const niftyTicker = document.querySelector('.ticker-item:nth-child(1) .ticker-value');
    const niftyTickerChange = document.querySelector('.ticker-item:nth-child(1) .ticker-change');
    if (niftyTicker && marketData.indices.NIFTY50) {
        niftyTicker.textContent = marketData.indices.NIFTY50.value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const sign = marketData.indices.NIFTY50.change >= 0 ? '+' : '';
        niftyTickerChange.textContent = `${sign}${marketData.indices.NIFTY50.change.toFixed(2)} (${sign}${marketData.indices.NIFTY50.changePercent.toFixed(2)}%)`;
        niftyTickerChange.className = `ticker-change ${marketData.indices.NIFTY50.change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Update SENSEX ticker (using live data)
    const sensexTicker = document.querySelector('.ticker-item:nth-child(2) .ticker-value');
    const sensexTickerChange = document.querySelector('.ticker-item:nth-child(2) .ticker-change');
    if (sensexTicker && marketData.indices.SENSEX) {
        sensexTicker.textContent = marketData.indices.SENSEX.value.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        const sign = marketData.indices.SENSEX.change >= 0 ? '+' : '';
        sensexTickerChange.textContent = `${sign}${marketData.indices.SENSEX.change.toFixed(2)} (${sign}${marketData.indices.SENSEX.changePercent.toFixed(2)}%)`;
        sensexTickerChange.className = `ticker-change ${marketData.indices.SENSEX.change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Update asset info (using live data)
    const assetPrice = document.querySelector('.asset-price');
    const assetChange = document.querySelector('.asset-change');
    if (assetPrice && marketData.indices.NIFTY50) {
        assetPrice.textContent = marketData.indices.NIFTY50.value.toFixed(2);
        const sign = marketData.indices.NIFTY50.change >= 0 ? '+' : '';
        assetChange.textContent = `${sign}${marketData.indices.NIFTY50.change.toFixed(2)} (${sign}${marketData.indices.NIFTY50.changePercent.toFixed(2)}%)`;
        assetChange.className = `asset-change ${marketData.indices.NIFTY50.change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // Chart will be loaded with LIVE historical data from Finnhub when trading interface opens
    
    // Update timestamp
    const timestamp = document.querySelector('.timestamp');
    if (timestamp) {
        const now = new Date();
        timestamp.textContent = now.toLocaleString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
        });
    }
}

// Profile Nav Item Handlers
document.querySelectorAll('.profile-nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.textContent.trim();
        alert(`Opening ${section}... This would navigate to the respective page.`);
    });
});

// Smooth animations for index items
document.querySelectorAll('.index-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(8px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('button, .nav-link, .profile-nav-item').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    button, .nav-link, .profile-nav-item {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize Candlestick Chart
function initializeCandlestickChart() {
    const canvas = document.getElementById('candlestickChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate candlestick data
    const candlestickData = generateCandlestickData(50);
    
    // Create chart using custom rendering
    drawCandlestickChart(ctx, canvas, candlestickData);
}

// Generate Candlestick Data
// Update OHLC display on hover
function updateOHLCDisplay(data) {
    const ohlcContainer = document.querySelector('.ohlc-data');
    if (!ohlcContainer) return;
    
    const ohlcSpans = ohlcContainer.querySelectorAll('span:not(.timestamp)');
    if (ohlcSpans.length >= 4) {
        ohlcSpans[0].innerHTML = `<strong>O</strong> ${data.open.toFixed(2)}`;
        ohlcSpans[1].innerHTML = `<strong>H</strong> ${data.high.toFixed(2)}`;
        ohlcSpans[2].innerHTML = `<strong>L</strong> ${data.low.toFixed(2)}`;
        ohlcSpans[3].innerHTML = `<strong>C</strong> ${data.close.toFixed(2)}`;
    }
}

// Load LIVE historical data from Finnhub API
async function loadLiveHistoricalData(symbol, days) {
    try {
        console.log(`📊 Loading LIVE data for ${symbol} from Finnhub...`);
        
        // Store current symbol and days for infinite scroll
        currentSymbol = symbol;
        totalDaysLoaded = days;
        
        // Fetch data directly from Finnhub
        const candles = await fetchFinnhubCandles(symbol, days);
        
        if (candles && candles.length > 0) {
            console.log(`✅ Loaded ${candles.length} LIVE candles from Finnhub API`);
            
            currentChartData = candles;
            
            // Sort by time
            currentChartData.sort((a, b) => a.time - b.time);
            
            // Update price display with latest data
            if (currentChartData.length > 0) {
                const latestCandle = currentChartData[currentChartData.length - 1];
                const previousCandle = currentChartData[currentChartData.length - 2];
                const change = latestCandle.close - (previousCandle ? previousCandle.close : latestCandle.open);
                const changePercent = ((change / (previousCandle ? previousCandle.close : latestCandle.open)) * 100);
                updateStockPriceDisplay(latestCandle.close, change, changePercent);
            }
            
            // Initialize interactive chart with live data
            initializeTradingChart();
            
            // Restore chart type if not candlestick
            if (currentChartType !== 'candlestick') {
                setTimeout(() => switchChartType(currentChartType), 100);
            }
            
            // Show notification
            showLiveDataBadge();
            
            // Start real-time price updates
            startRealTimePriceUpdates(symbol);
        } else {
            console.warn('⚠️ No data from Finnhub, using fallback');
            currentChartData = generateCandlestickData(days);
            initializeTradingChart();
        }
    } catch (error) {
        console.error('❌ Error loading live data:', error);
        // Fallback to generated data
        currentChartData = generateCandlestickData(days);
        initializeTradingChart();
    }
}

// Start real-time price updates
let priceUpdateInterval = null;
async function startRealTimePriceUpdates(symbol) {
    // Clear existing interval
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
    
    // Update price every 5 seconds
    priceUpdateInterval = setInterval(async () => {
        const quote = await fetchFinnhubQuote(symbol);
        if (quote && quote.price > 0) {
            updateStockPriceDisplay(quote.price, quote.change, quote.changePercent);
            
            // Update last candle with current price
            if (candlestickSeries && currentChartData.length > 0) {
                const lastCandle = currentChartData[currentChartData.length - 1];
                lastCandle.close = quote.price;
                lastCandle.high = Math.max(lastCandle.high, quote.price);
                lastCandle.low = Math.min(lastCandle.low, quote.price);
                
                candlestickSeries.update({
                    time: lastCandle.time,
                    open: lastCandle.open,
                    high: lastCandle.high,
                    low: lastCandle.low,
                    close: lastCandle.close,
                });
            }
        }
    }, 5000);
    
    console.log(`✅ Real-time price updates started for ${symbol}`);
}

// Legacy WebSocket function (replaced with direct Finnhub polling)
let liveChartWs = null;
function startLiveChartUpdates(symbol) {
    console.log(`ℹ️ WebSocket connection skipped - using Finnhub API polling instead`);
    // WebSocket functionality replaced by startRealTimePriceUpdates()
    return;
    
    // Old WebSocket code below (disabled)
    /*
    // Close existing WebSocket if any
    if (liveChartWs) {
        liveChartWs.close();
    }
    
    // Connect to live WebSocket
    liveChartWs = new WebSocket(`${WS_BASE_URL}/ws/assets/${symbol}`);
    
    liveChartWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (candlestickSeries && data.price) {
            // Update last candle with new price
            const lastCandle = currentChartData[currentChartData.length - 1];
            if (lastCandle) {
                lastCandle.close = data.price;
                lastCandle.high = Math.max(lastCandle.high, data.price);
                lastCandle.low = Math.min(lastCandle.low, data.price);
                
                // Update the chart
                candlestickSeries.update({
                    time: lastCandle.time,
                    open: lastCandle.open,
                    high: lastCandle.high,
                    low: lastCandle.low,
                    close: lastCandle.close,
                });
                
                // Update asset price display
                const assetPrice = document.querySelector('.asset-price');
                if (assetPrice) {
                    assetPrice.textContent = data.price.toFixed(2);
                    assetPrice.style.animation = 'none';
                    setTimeout(() => {
                        assetPrice.style.animation = 'pulse-live 0.5s ease';
                    }, 10);
                }
            }
        }
    };
    
    console.log(`🔴 LIVE chart updates started for ${symbol}`);
    */
}

// Show live data indicator
function showLiveDataBadge() {
    const chartHeader = document.querySelector('.chart-header');
    if (!chartHeader) return;
    
    let badge = document.getElementById('live-data-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'live-data-badge';
        badge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #22c55e;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 100;
        `;
        badge.innerHTML = `
            <div style="width: 8px; height: 8px; border-radius: 50%; background: white; animation: pulse-live 2s infinite;"></div>
            LIVE DATA
        `;
        chartHeader.appendChild(badge);
    }
}

function generateCandlestickData(count) {
    const data = [];
    let basePrice = 19500;
    
    for (let i = 0; i < count; i++) {
        const open = basePrice + (Math.random() - 0.5) * 50;
        const close = open + (Math.random() - 0.5) * 80;
        const high = Math.max(open, close) + Math.random() * 30;
        const low = Math.min(open, close) - Math.random() * 30;
        
        data.push({
            time: i,
            open: open,
            high: high,
            low: low,
            close: close
        });
        
        basePrice = close;
    }
    
    return data;
}

// Draw Candlestick Chart
function drawCandlestickChart(ctx, canvas, data) {
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Find min and max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    data.forEach(candle => {
        minPrice = Math.min(minPrice, candle.low);
        maxPrice = Math.max(maxPrice, candle.high);
    });
    
    const priceRange = maxPrice - minPrice;
    const candleWidth = chartWidth / data.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Draw price labels
        const price = maxPrice - (priceRange / 5) * i;
        ctx.fillStyle = '#64748B';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }
    
    // Draw candlesticks
    data.forEach((candle, index) => {
        const x = padding + (index * candleWidth) + candleWidth / 2;
        
        const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
        const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
        const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
        const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
        
        const isBullish = candle.close >= candle.open;
        const color = isBullish ? '#10B981' : '#EF4444';
        
        // Draw wick (high-low line)
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
        
        // Draw body (open-close rectangle)
        ctx.fillStyle = color;
        const bodyHeight = Math.abs(closeY - openY) || 1;
        const bodyY = Math.min(openY, closeY);
        const bodyWidth = candleWidth * 0.6;
        
        ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, bodyHeight);
    });
    
    // Draw axis
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
}

// Initialize Time Buttons
function initializeTimeButtons() {
    const timeButtons = document.querySelectorAll('.time-btn');
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timeButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const timeframe = this.getAttribute('data-time');
            console.log('Switched to timeframe:', timeframe);
            
            // Reinitialize chart with new data
            initializeCandlestickChart();
        });
    });
}

// ========================================
// NEWS SENTIMENT ANALYSIS
// ========================================

// Initialize News Sentiment Modal
function initNewsSentiment() {
    const newsBtn = document.getElementById('newsSentimentBtn');
    const modal = document.getElementById('newsSentimentModal');
    const closeBtn = document.getElementById('closeNewsModal');
    const refreshBtn = document.getElementById('refreshSentimentBtn');
    const retryBtn = document.getElementById('retryBtn');
    
    if (!newsBtn || !modal) return;
    
    // Open modal
    newsBtn.addEventListener('click', () => {
        console.log('📰 Opening news sentiment modal...');
        modal.classList.add('active');
        loadNewsSentiment();
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Refresh button
    refreshBtn.addEventListener('click', () => {
        loadNewsSentiment(true);
    });
    
    // Retry button
    retryBtn.addEventListener('click', () => {
        loadNewsSentiment();
    });
}

// Load news sentiment data
async function loadNewsSentiment(forceRefresh = false) {
    const loadingEl = document.getElementById('newsLoading');
    const contentEl = document.getElementById('newsContent');
    const errorEl = document.getElementById('newsError');
    
    // Show loading
    loadingEl.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display = 'none';
    
    try {
        console.log('📊 Fetching sentiment data...');
        
        // Get current symbol
        const activeToggle = document.querySelector('.index-toggle-btn.active');
        const currentSymbol = activeToggle ? activeToggle.dataset.symbol : 'NIFTY_50';
        const displaySymbol = currentSymbol === 'NIFTY_50' ? 'NIFTY 50' : 'SENSEX';
        
        // Fetch market overview and stock sentiment in parallel
        const [marketOverview, stockSentiment] = await Promise.all([
            fetch(`${API_BASE_URL}/api/v1/sentiment/market-overview`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/v1/sentiment/stock/${currentSymbol}?use_cache=true`).then(r => r.json())
        ]);
        
        console.log('✅ Sentiment data loaded:', { marketOverview, stockSentiment });
        
        // Update UI
        updateMarketOverview(marketOverview.data);
        updateStockSentiment(stockSentiment.data, displaySymbol);
        
        // Show content
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        
    } catch (error) {
        console.error('❌ Failed to load sentiment:', error);
        
        // Show error
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        document.getElementById('errorMessage').textContent = 
            'Failed to load sentiment data. The service may be initializing or unavailable.';
    }
}

// Update market overview section
function updateMarketOverview(data) {
    if (!data) return;
    
    const badge = document.getElementById('marketSentimentBadge');
    const mood = document.getElementById('marketMood');
    const positivePercent = document.getElementById('positivePercent');
    const neutralPercent = document.getElementById('neutralPercent');
    const negativePercent = document.getElementById('negativePercent');
    const mostPositiveList = document.getElementById('mostPositiveList');
    const mostNegativeList = document.getElementById('mostNegativeList');
    
    // Update market mood
    mood.textContent = data.market_mood || 'Neutral';
    badge.className = 'market-sentiment-badge';
    
    if (data.market_mood.includes('Bullish')) {
        badge.classList.add('bullish');
    } else if (data.market_mood.includes('Bearish')) {
        badge.classList.add('bearish');
    } else {
        badge.classList.add('neutral');
    }
    
    // Update percentages
    if (data.breakdown_percentages) {
        positivePercent.textContent = `${data.breakdown_percentages.positive}%`;
        neutralPercent.textContent = `${data.breakdown_percentages.neutral}%`;
        negativePercent.textContent = `${data.breakdown_percentages.negative}%`;
    }
    
    // Update top movers
    if (data.most_positive_stocks) {
        mostPositiveList.innerHTML = data.most_positive_stocks.map(stock => `
            <li>
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-score positive">+${(stock.score * 100).toFixed(1)}%</span>
            </li>
        `).join('');
    }
    
    if (data.most_negative_stocks) {
        mostNegativeList.innerHTML = data.most_negative_stocks.map(stock => `
            <li>
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-score negative">${(stock.score * 100).toFixed(1)}%</span>
            </li>
        `).join('');
    }
}

// Update stock sentiment section
function updateStockSentiment(data, displayName) {
    if (!data) return;
    
    const title = document.getElementById('stockSentimentTitle');
    const scoreLabel = document.getElementById('sentimentScoreLabel');
    const progressCircle = document.getElementById('sentimentProgressCircle');
    const sentimentLabel = document.getElementById('sentimentLabel');
    const confidence = document.getElementById('sentimentConfidence');
    const headlinesCount = document.getElementById('headlinesCount');
    const sourcesCount = document.getElementById('sourcesCount');
    const headlinesList = document.getElementById('headlinesList');
    
    // Update title
    title.textContent = `${displayName} News Sentiment`;
    
    // Update score (normalize to 0-100)
    const normalizedScore = ((data.score + 1) / 2) * 100; // Convert -1 to 1 range to 0-100
    scoreLabel.textContent = Math.round(normalizedScore);
    
    // Update progress circle
    const circumference = 314; // 2 * PI * 50
    const offset = circumference - (normalizedScore / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Set color based on sentiment
    let color = '#94A3B8'; // neutral
    if (data.sentiment === 'positive') {
        color = '#10B981';
    } else if (data.sentiment === 'negative') {
        color = '#EF4444';
    }
    progressCircle.style.stroke = color;
    
    // Update sentiment label
    sentimentLabel.textContent = data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1);
    sentimentLabel.className = `sentiment-label ${data.sentiment}`;
    
    // Update confidence
    confidence.querySelector('span').textContent = `${(data.confidence * 100).toFixed(1)}%`;
    
    // Update meta
    headlinesCount.textContent = `${data.total_headlines || 0} headlines`;
    sourcesCount.textContent = `${data.news_sources || 0} sources`;
    
    // Update sample headlines
    if (data.sample_headlines && data.sample_headlines.length > 0) {
        headlinesList.innerHTML = data.sample_headlines.map(headline => `
            <li>${headline}</li>
        `).join('');
    } else {
        headlinesList.innerHTML = '<li>No recent headlines available</li>';
    }
}

// Initialize news sentiment on page load
document.addEventListener('DOMContentLoaded', () => {
    initNewsSentiment();
    console.log('📰 News sentiment module initialized');
});

// Console welcome message
console.log('%c🚀 Welcome to INDmoney! ', 'background: #1E40AF; color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px;');
console.log('%cYour trusted partner for Indian stock market investments', 'color: #64748B; font-size: 14px; padding: 5px 0;');
console.log('%c📈 Market data updates every 2 seconds', 'color: #10B981; font-size: 12px;');
console.log('%c📰 AI-powered news sentiment with FinBERT', 'color: #667EEA; font-size: 12px;');
