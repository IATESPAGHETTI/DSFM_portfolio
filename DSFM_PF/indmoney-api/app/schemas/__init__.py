from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    kyc_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Asset Schemas
class AssetBase(BaseModel):
    symbol: str
    name: str
    asset_type: str
    exchange: Optional[str] = None


class AssetResponse(AssetBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Portfolio Schemas
class PortfolioResponse(BaseModel):
    id: int
    asset: AssetResponse
    quantity: Decimal
    average_price: Optional[Decimal]
    current_value: Optional[Decimal] = None
    profit_loss: Optional[Decimal] = None
    
    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionCreate(BaseModel):
    asset_symbol: str
    transaction_type: str = Field(..., pattern="^(buy|sell)$")
    quantity: Decimal = Field(..., gt=0)
    price_per_unit: Decimal = Field(..., gt=0)


class TransactionResponse(BaseModel):
    id: int
    asset: AssetResponse
    transaction_type: str
    quantity: Decimal
    price: Decimal
    total_amount: Decimal
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Historical Price Schemas
class HistoricalPriceResponse(BaseModel):
    date: date
    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: int
    
    class Config:
        from_attributes = True


# Market Regime Schemas
class MarketRegimeResponse(BaseModel):
    id: int
    regime_name: str
    description: Optional[str]
    confidence_score: Optional[Decimal]
    features: Optional[dict]
    last_updated: datetime
    
    class Config:
        from_attributes = True


# Volatility Forecast Schemas
class VolatilityForecastResponse(BaseModel):
    forecast_date: date
    forecast_value: Decimal
    forecast_horizon: Optional[int]
    
    class Config:
        from_attributes = True


# WebSocket Message Schemas
class PriceTick(BaseModel):
    symbol: str
    price: Decimal
    change: Decimal
    change_percent: Decimal
    volume: int
    timestamp: datetime
