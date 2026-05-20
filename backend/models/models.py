from sqlalchemy import Column, Integer, String, Float, Enum, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database.database import Base

class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

class IncomeFrequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", back_populates="owner", cascade="all, delete-orphan")
    income_sources = relationship("IncomeSource", back_populates="owner", cascade="all, delete-orphan")

class IncomeSource(Base):
    __tablename__ = "income_sources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    frequency = Column(Enum(IncomeFrequency), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="income_sources")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="transactions")
