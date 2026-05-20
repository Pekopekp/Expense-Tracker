from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import date, datetime
from database import database
from schemas import schemas
from models import models
from auth import auth_handler

router = APIRouter(
    prefix="/api/transactions",
    tags=['Transactions']
)

@router.post("/", response_model=schemas.TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    new_transaction = models.Transaction(user_id=current_user.id, **transaction.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/", response_model=List[schemas.TransactionResponse])
def get_transactions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    type: Optional[models.TransactionType] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    query = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id)
    
    if category:
        query = query.filter(models.Transaction.category.ilike(f"%{category}%"))
    if type:
        query = query.filter(models.Transaction.type == type)
    if start_date:
        query = query.filter(models.Transaction.date >= start_date)
    if end_date:
        query = query.filter(models.Transaction.date <= end_date)
        
    transactions = query.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user),
    month: Optional[int] = None,
    year: Optional[int] = None
):
    query = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id)
    
    if month and year:
        query = query.filter(extract('month', models.Transaction.date) == month, extract('year', models.Transaction.date) == year)
    
    transactions = query.all()
    
    # Calculate one-off income and total expense
    one_off_income = sum(t.amount for t in transactions if t.type == models.TransactionType.income)
    total_expense = sum(t.amount for t in transactions if t.type == models.TransactionType.expense)
    
    # Calculate monthly equivalent of income sources
    income_sources = db.query(models.IncomeSource).filter(models.IncomeSource.user_id == current_user.id).all()
    monthly_income_from_sources = 0
    for source in income_sources:
        if source.frequency == models.IncomeFrequency.yearly:
            monthly_income_from_sources += (source.amount / 12.0)
        elif source.frequency == models.IncomeFrequency.weekly:
            monthly_income_from_sources += (source.amount * 4.333)
        elif source.frequency == models.IncomeFrequency.daily:
            monthly_income_from_sources += (source.amount * 30.416)
        else:
            monthly_income_from_sources += source.amount
            
    total_income = one_off_income + monthly_income_from_sources
    remaining_balance = total_income - total_expense
    
    # Recent 5 transactions
    recent_transactions = sorted(transactions, key=lambda x: x.date, reverse=True)[:5]
    
    # Expense by category
    expense_by_category = {}
    for t in transactions:
        if t.type == models.TransactionType.expense:
            if t.category in expense_by_category:
                expense_by_category[t.category] += t.amount
            else:
                expense_by_category[t.category] = t.amount
                
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "remaining_balance": remaining_balance,
        "recent_transactions": recent_transactions,
        "expense_by_category": expense_by_category
    }

@router.get("/{id}", response_model=schemas.TransactionResponse)
def get_transaction(
    id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == id, models.Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction

@router.put("/{id}", response_model=schemas.TransactionResponse)
def update_transaction(
    id: int, 
    transaction_update: schemas.TransactionUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    transaction_query = db.query(models.Transaction).filter(models.Transaction.id == id, models.Transaction.user_id == current_user.id)
    transaction = transaction_query.first()
    
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    update_data = transaction_update.model_dump(exclude_unset=True)
    transaction_query.update(update_data, synchronize_session=False)
    db.commit()
    
    return transaction_query.first()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    transaction_query = db.query(models.Transaction).filter(models.Transaction.id == id, models.Transaction.user_id == current_user.id)
    transaction = transaction_query.first()
    
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
        
    transaction_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Transaction deleted successfully"}
