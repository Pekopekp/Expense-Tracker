from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional, List
from models.models import TransactionType, IncomeFrequency

# User Schemas
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None

class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

# Transaction Schemas
class TransactionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    type: TransactionType
    date: date
    description: Optional[str] = Field(None, max_length=500)

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[TransactionType] = None
    date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Dashboard Summary Schema
class DashboardSummary(BaseModel):
    total_income: float
    total_expense: float
    remaining_balance: float
    recent_transactions: List[TransactionResponse]
    expense_by_category: dict

# Income Source Schemas
class IncomeSourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    frequency: IncomeFrequency

class IncomeSourceCreate(IncomeSourceBase):
    pass

class IncomeSourceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    frequency: Optional[IncomeFrequency] = None

class IncomeSourceResponse(IncomeSourceBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
