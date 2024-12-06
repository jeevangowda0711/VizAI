# main.py

"""
Main entry point for the FastAPI backend application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User
from app.models.visualization import Visualization
from app.models.dataset import Dataset
from app.core.config import DevelopmentConfig
from app.api.auth import router as auth_router
from app.api.dataset_upload import router as dataset_upload_router
from app.api.visualization import router as visualization_router
from app.api.ai_insights import router as ai_insights_router

DATABASE_URL = DevelopmentConfig.SQLALCHEMY_DATABASE_URI

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# Allow CORS for all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables
Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def on_startup():
    pass

@app.on_event("shutdown")
def on_shutdown():
    pass

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(dataset_upload_router, prefix="/datasets", tags=["datasets"])
app.include_router(visualization_router, prefix="/visualizations", tags=["visualizations"])
app.include_router(ai_insights_router, prefix="/ai", tags=["ai"])