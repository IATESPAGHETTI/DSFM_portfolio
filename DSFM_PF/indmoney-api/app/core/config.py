from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://indmoney:indmoney_secret@localhost:5432/indmoney"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT Authentication
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Keys
    MARKET_DATA_API_KEY: Optional[str] = None
    
    # Application
    APP_NAME: str = "INDmoney API"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"


settings = Settings()
