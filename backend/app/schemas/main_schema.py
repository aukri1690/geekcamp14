from pydantic import BaseModel, EmailStr


class CardCreate(BaseModel):
    name: str
    message: str
    image_url: str | None = None
    user_id: str  # ログインユーザーID
    card_id: str
    sns_link:str