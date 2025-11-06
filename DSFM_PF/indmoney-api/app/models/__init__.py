from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Text, Date, BigInteger, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    kyc_status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)  # 'stock', 'index', 'mutual_fund'
    exchange = Column(String)  # 'NSE', 'BSE'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    portfolios = relationship("Portfolio", back_populates="asset")
    transactions = relationship("Transaction", back_populates="asset")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False)
    average_price = Column(Numeric(18, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="portfolios")
    asset = relationship("Asset", back_populates="portfolios")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    transaction_type = Column(String, nullable=False)  # 'buy', 'sell'
    quantity = Column(Numeric(18, 4), nullable=False)
    price = Column(Numeric(18, 2), nullable=False)
    total_amount = Column(Numeric(18, 2), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")
    asset = relationship("Asset", back_populates="transactions")


class MarketRegime(Base):
    __tablename__ = "market_regimes"

    id = Column(Integer, primary_key=True, index=True)
    regime_name = Column(String, nullable=False)
    description = Column(Text)
    confidence_score = Column(Numeric(5, 2))
    features = Column(JSON)  # Store feature values as JSON
    last_updated = Column(DateTime(timezone=True), server_default=func.now())


class VolatilityForecast(Base):
    __tablename__ = "volatility_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    asset_symbol = Column(String, nullable=False, index=True)
    forecast_date = Column(Date, nullable=False)
    forecast_value = Column(Numeric(10, 6), nullable=False)
    forecast_horizon = Column(Integer)  # number of days ahead
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class HistoricalPrice(Base):
    __tablename__ = "historical_prices"

    id = Column(Integer, primary_key=True, index=True)
    asset_symbol = Column(String, nullable=False, index=True)
    date = Column(Date, nullable=False)
    open = Column(Numeric(18, 2))
    high = Column(Numeric(18, 2))
    low = Column(Numeric(18, 2))
    close = Column(Numeric(18, 2))
    volume = Column(BigInteger)
