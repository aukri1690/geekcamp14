from fastapi import APIRouter, HTTPException, Depends,Header
from pydantic import BaseModel
from uuid import uuid4
from app.db.supabase import supabase
import jwt

router = APIRouter()



# JWTからユーザーIDを取得
def get_current_user_id(authorization: str = Header(...)) -> str:
    try:
        # "Bearer <token>" の形式
        token = authorization.split(" ")[1]

        # トークンデコード（署名検証なしの簡易版）
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="ユーザーIDが取得できません")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="認証エラー")
    

class CardCreate(BaseModel):
    name: str
    message: str
    image_url: str | None = None
    user_id: str  # ログインユーザーID

# カード作成
@router.post("/cards")
async def create_card(card: CardCreate, user_id: str = Depends(get_current_user_id)):
    card_id = str(uuid4())
    data = {
        "id": card_id,
        "user_id": card.user_id,
        "name": card.name,
        "message": card.message,
        "image_url": card.image_url,
    }
    result = supabase.table("cards").insert(data).execute()
    return {"card_id": card_id, "share_url": f"https://yourapp.com/card/{card_id}"}

# カード取得
@router.get("/cards/{card_id}")
async def get_card(card_id: str):
    result = supabase.table("cards").select("*").eq("id", card_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Card not found")
    return result.data[0]
