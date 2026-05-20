import os
from sqlalchemy.orm import Session
from database.database import SessionLocal, engine
from models import models
from auth.utils import get_password_hash
from datetime import date, timedelta
import random

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Create a test user
        test_email = "test@example.com"
        user = db.query(models.User).filter(models.User.email == test_email).first()
        if not user:
            print("Creating test user...")
            hashed_password = get_password_hash("password123")
            user = models.User(name="Test User", email=test_email, password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Check if transactions exist
        existing_transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).count()
        if existing_transactions == 0:
            print("Adding sample transactions...")
            categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping']
            income_categories = ['Salary', 'Freelance', 'Investment']
            
            # Generate 20 transactions
            for i in range(20):
                is_expense = random.choice([True, True, True, False]) # 75% expense
                
                transaction = models.Transaction(
                    user_id=user.id,
                    title=f"Sample Transaction {i+1}",
                    amount=round(random.uniform(10.0, 500.0) if is_expense else random.uniform(1000.0, 5000.0), 2),
                    category=random.choice(categories) if is_expense else random.choice(income_categories),
                    type=models.TransactionType.expense if is_expense else models.TransactionType.income,
                    date=date.today() - timedelta(days=random.randint(0, 30)),
                    description="This is an automatically generated sample transaction."
                )
                db.add(transaction)
            
            db.commit()
            print("Sample data seeded successfully!")
        else:
            print("Database already has transaction data for test user.")
            
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
