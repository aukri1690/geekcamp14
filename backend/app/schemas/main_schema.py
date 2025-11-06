from pydantic import BaseModel
from typing import Optional
from datetime import date

class CardCreate(BaseModel):
    name: str
    furigana: str
    photo_url: Optional[str] = None
    design_id: Optional[str] = None
    design_name: Optional[str] = None
    job: Optional[str] = None
    student: Optional[str] = None
    interest: Optional[str] = None
    goal: Optional[str] = None
    hobby: Optional[str] = None
    qualification: Optional[str] = None
    sns_link: Optional[str] = None
    free_text: Optional[str] = None
    birthday: Optional[date] = None
    
class CardUpdate(BaseModel):
    name: Optional[str] = None
    furigana: Optional[str] = None
    photo_url: Optional[str] = None
    design_id: Optional[str] = None
    design_name: Optional[str] = None
    job: Optional[str] = None
    student: Optional[str] = None
    interest: Optional[str] = None
    goal: Optional[str] = None
    hobby: Optional[str] = None
    qualification: Optional[str] = None
    sns_link: Optional[str] = None
    free_text: Optional[str] = None
    birthday: Optional[str] = None
