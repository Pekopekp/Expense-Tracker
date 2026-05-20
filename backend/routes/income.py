from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import database
from schemas import schemas
from models import models
from auth import auth_handler

router = APIRouter(
    prefix="/api/income",
    tags=['Income Sources']
)

@router.post("/", response_model=schemas.IncomeSourceResponse, status_code=status.HTTP_201_CREATED)
def create_income_source(
    income_source: schemas.IncomeSourceCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    new_income_source = models.IncomeSource(user_id=current_user.id, **income_source.model_dump())
    db.add(new_income_source)
    db.commit()
    db.refresh(new_income_source)
    return new_income_source

@router.get("/", response_model=List[schemas.IncomeSourceResponse])
def get_income_sources(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    return db.query(models.IncomeSource).filter(models.IncomeSource.user_id == current_user.id).all()

@router.put("/{id}", response_model=schemas.IncomeSourceResponse)
def update_income_source(
    id: int, 
    income_source_update: schemas.IncomeSourceUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    query = db.query(models.IncomeSource).filter(models.IncomeSource.id == id, models.IncomeSource.user_id == current_user.id)
    income_source = query.first()
    
    if not income_source:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income source not found")
        
    update_data = income_source_update.model_dump(exclude_unset=True)
    query.update(update_data, synchronize_session=False)
    db.commit()
    
    return query.first()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income_source(
    id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    query = db.query(models.IncomeSource).filter(models.IncomeSource.id == id, models.IncomeSource.user_id == current_user.id)
    income_source = query.first()
    
    if not income_source:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income source not found")
        
    query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Income source deleted successfully"}
