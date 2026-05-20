from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import database
from schemas import schemas
from models import models
from auth import utils, auth_handler

router = APIRouter(
    prefix="/api/auth",
    tags=['Authentication']
)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Hash the password
    hashed_password = utils.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
        
    if not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
        
    # Create token
    access_token = auth_handler.create_access_token(
        data={"id": user.id, "email": user.email},
        expires_delta=auth_handler.timedelta(minutes=auth_handler.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email}}

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    user_update: schemas.UserUpdate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    user_query = db.query(models.User).filter(models.User.id == current_user.id)
    user = user_query.first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    if user_update.email and user_update.email != user.email:
        existing_user = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already taken")
            
    update_data = user_update.model_dump(exclude_unset=True)
    user_query.update(update_data, synchronize_session=False)
    db.commit()
    
    return user_query.first()

@router.put("/change-password")
def change_password(
    password_data: schemas.ChangePassword,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth_handler.get_current_user)
):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    if not utils.verify_password(password_data.old_password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
        
    hashed_new_password = utils.get_password_hash(password_data.new_password)
    user.password = hashed_new_password
    db.commit()
    
    return {"message": "Password updated successfully"}
