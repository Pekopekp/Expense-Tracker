from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine
from models import models
from routes import auth, transactions, income

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Expense Tracker API",
    description="REST API for Expense Tracker Application",
    version="1.0.0"
)

# Setup CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*" # For development, we allow all
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(income.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Personal Expense Tracker API"}
