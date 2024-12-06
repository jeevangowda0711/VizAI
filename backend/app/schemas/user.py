# schemas/user.py

"""
Defines Pydantic models for user-related requests and responses.
"""

from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True