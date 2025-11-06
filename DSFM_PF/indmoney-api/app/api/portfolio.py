from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Portfolio, Asset, Transaction
from app.schemas import PortfolioResponse, TransactionCreate
from typing import List
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[PortfolioResponse])
async def get_portfolio(db: Session = Depends(get_db)):
    """Get user's portfolio holdings"""
    # For demo, get all portfolios (in real app, filter by user_id from JWT)
    holdings = db.query(Portfolio).all()
    return holdings


@router.post("/trade", response_model=dict)
async def create_trade(trade: TransactionCreate, db: Session = Depends(get_db)):
    """Execute a buy/sell trade"""
    # Get asset
    asset = db.query(Asset).filter(Asset.symbol == trade.asset_symbol).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # For demo, use first user (in real app, get from JWT)
    user_id = 1
    
    # Create transaction
    transaction = Transaction(
        user_id=user_id,
        asset_id=asset.id,
        transaction_type=trade.transaction_type,
        quantity=trade.quantity,
        price_per_unit=trade.price_per_unit,
        total_amount=trade.quantity * trade.price_per_unit,
        transaction_date=datetime.utcnow()
    )
    db.add(transaction)
    
    # Update or create portfolio holding
    holding = db.query(Portfolio).filter(
        Portfolio.user_id == user_id,
        Portfolio.asset_id == asset.id
    ).first()
    
    if holding:
        if trade.transaction_type == "buy":
            holding.quantity += trade.quantity
            holding.average_price = (
                (holding.average_price * (holding.quantity - trade.quantity)) + 
                (trade.price_per_unit * trade.quantity)
            ) / holding.quantity
        else:  # sell
            holding.quantity -= trade.quantity
    else:
        if trade.transaction_type == "buy":
            holding = Portfolio(
                user_id=user_id,
                asset_id=asset.id,
                quantity=trade.quantity,
                average_price=trade.price_per_unit
            )
            db.add(holding)
    
    db.commit()
    
    return {
        "status": "success",
        "transaction_id": transaction.id,
        "message": f"{trade.transaction_type.upper()} order executed"
    }
