-- INDmoney Database Schema
-- Initialize the database with required tables

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    kyc_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'stock', 'index', 'mutual_fund'
    exchange VARCHAR(50), -- 'NSE', 'BSE'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    quantity DECIMAL(18, 4) NOT NULL,
    average_price DECIMAL(18, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, asset_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    quantity DECIMAL(18, 4) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    total_amount DECIMAL(18, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_regimes (
    id SERIAL PRIMARY KEY,
    regime_name VARCHAR(100) NOT NULL,
    description TEXT,
    confidence_score DECIMAL(5, 2),
    features JSONB, -- Store feature values
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volatility_forecasts (
    id SERIAL PRIMARY KEY,
    asset_symbol VARCHAR(50) NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_value DECIMAL(10, 6) NOT NULL,
    forecast_horizon INTEGER, -- number of days ahead
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_symbol, forecast_date)
);

CREATE TABLE IF NOT EXISTS historical_prices (
    id SERIAL PRIMARY KEY,
    asset_symbol VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    open DECIMAL(18, 2),
    high DECIMAL(18, 2),
    low DECIMAL(18, 2),
    close DECIMAL(18, 2),
    volume BIGINT,
    UNIQUE(asset_symbol, date)
);

-- Indexes for better query performance
CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_asset ON transactions(asset_id);
CREATE INDEX idx_historical_prices_symbol_date ON historical_prices(asset_symbol, date);
CREATE INDEX idx_volatility_forecasts_symbol ON volatility_forecasts(asset_symbol);

-- Insert sample assets (Indian market)
INSERT INTO assets (symbol, name, asset_type, exchange) VALUES
('NIFTY_50', 'NIFTY 50', 'index', 'NSE'),
('SENSEX', 'BSE SENSEX', 'index', 'BSE'),
('BANKNIFTY', 'BANK NIFTY', 'index', 'NSE'),
('RELIANCE', 'Reliance Industries Ltd', 'stock', 'NSE'),
('TCS', 'Tata Consultancy Services', 'stock', 'NSE'),
('HDFCBANK', 'HDFC Bank Ltd', 'stock', 'NSE'),
('INFY', 'Infosys Ltd', 'stock', 'NSE'),
('ICICIBANK', 'ICICI Bank Ltd', 'stock', 'NSE'),
('HINDUNILVR', 'Hindustan Unilever Ltd', 'stock', 'NSE'),
('ITC', 'ITC Ltd', 'stock', 'NSE'),
('SBIN', 'State Bank of India', 'stock', 'NSE'),
('BHARTIARTL', 'Bharti Airtel Ltd', 'stock', 'NSE'),
('KOTAKBANK', 'Kotak Mahindra Bank Ltd', 'stock', 'NSE'),
('LT', 'Larsen & Toubro Ltd', 'stock', 'NSE'),
('HCLTECH', 'HCL Technologies Ltd', 'stock', 'NSE');
