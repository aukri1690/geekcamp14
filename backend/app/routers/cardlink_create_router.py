from fastapi import APIRouter, HTTPException, Depends,Header, UploadFile
from pydantic import BaseModel
from uuid import uuid4
from app.db.supabase import supabase
import jwt
from datetime import date, datetime, timezone
from app.schemas.main_schema import CardCreate,CardUpdate
from app.core.config import settings

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


@router.post("/cards_create")
async def create_card(card: CardCreate, user_id: str = Depends(get_current_user_id)):
    print("📥 受け取ったデータ:", card.dict())
    """
    認証済みユーザーがカードを作成するエンドポイント
    """
    try:
        # カードID生成
        card_id = str(uuid4())

        # 辞書化して Supabase に渡すデータを整形
        data = {
            "card_id": card_id,
            "user_id": user_id,
            "name": card.name,
            "furigana": card.furigana,
            "photo_url": card.photo_url,
            "design_id": card.design_id,
            "design_name": card.design_name,
            "job": card.job,
            "student": card.student,
            "interest": card.interest,
            "goal": card.goal,
            "hobby": card.hobby,
            "qualification": card.qualification,
            "sns_link": card.sns_link,
            "free_text": card.free_text,
            "birthday": card.birthday,
        }

        # Supabaseに送る前に date/datetime を文字列化
        for key, value in data.items():
            if isinstance(value, (date, datetime)):
                data[key] = value.isoformat()

        # Supabaseへ挿入
        result = supabase.table("cards").insert(data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="カードの作成に失敗しました")

        # 公開用URL（仮）デプロイの時に変更
        share_url = f"http://localhost:3000/my-card/{card_id}"
        print(share_url)
        return {
            "message": "カードを作成しました",
            "card_id": card_id,
            "share_url": share_url,
            "data": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"サーバーエラー: {str(e)}")
    
    
    
@router.patch("/cards/{card_id}")
async def update_card(card_id: str, card: CardUpdate, user_id: str = Depends(get_current_user_id)):
    """
    認証済みユーザーが自分のカードを部分更新するエンドポイント
    """

    # 既存カードの存在確認
    existing = supabase.table("cards").select("*").eq("card_id", card_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="カードが見つかりません")

    # 自分のカードであるか確認
    if existing.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="編集権限がありません")

    # 更新データ（指定された項目だけ抽出）
    update_data = card.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="更新内容がありません")

    # 更新日時の追加
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    # Supabaseへ更新
    result = supabase.table("cards").update(update_data).eq("card_id", card_id).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="カードの更新に失敗しました")

    # 更新後のデータを返す
    return {
        "message": "カードを更新しました",
        "card": result.data[0]
    }
    
# カード削除
@router.delete("/cards/{card_id}")
async def delete_card(card_id: str, user_id: str = Depends(get_current_user_id)):
    existing = supabase.table("cards").select("*").eq("card_id", card_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="カードが見つかりません")

    if existing.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="削除権限がありません")

    supabase.table("cards").delete().eq("card_id", card_id).execute()
    return {"message": "カードを削除しました", "card_id": card_id}


#全ユーザが閲覧可能
@router.get("/cards/view/{card_id}")
async def view_card(card_id: str):
    result = supabase.table("cards").select("*").eq("card_id", card_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    
    card = result.data[0]

    public_card = {
        "name": card["name"],
        "furigana": card["furigana"],
        "photo_url": card.get("photo_url"),
        "design_id": card.get("design_id"),
        "design_name": card.get("design_name"),
        "job": card.get("job"),
        "student": card.get("student"),
        "interest": card.get("interest"),
        "goal": card.get("goal"),
        "hobby": card.get("hobby"),
        "qualification": card.get("qualification"),
        "sns_link": card.get("sns_link"),
        "free_text": card.get("free_text"),
        "birthday": card.get("birthday"),
    }

    return public_card

#写真画像登録
@router.post("/upload_photo/{card_id}")
async def upload_photo(card_id: str, file: UploadFile, user_id: str = Depends(get_current_user_id)):
    try:
        file_ext = file.filename.split(".")[-1]
        file_name = f"{card_id}/{uuid4()}.{file_ext}"
        
        res = supabase.storage.from_("card_photos").upload(file_name, await file.read())
        if res.status_code != 200:
            raise HTTPException(status_code=500, detail="アップロードに失敗しました")
        
        public_url = supabase.storage.from_("card_photos").get_public_url(file_name)
        return {"photo_url": public_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#写真更新
@router.put("/cards/{card_id}/photo")
async def update_card_photo(card_id: str, file: UploadFile, user_id: str = Depends(get_current_user_id)):
    # カード取得
    existing = supabase.table("cards").select("*").eq("card_id", card_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    
    if existing.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="編集権限がありません")
    
    # 上書き用ファイル名（固定1枚）
    file_ext = file.filename.split(".")[-1]
    file_name = f"{card_id}/photo.{file_ext}"
    
    # Storageに上書きアップロード
    res = supabase.storage.from_("card_photos").upload(file_name, await file.read(), {"upsert": True})
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="アップロードに失敗しました")
    
    # URLは固定
    public_url = f"https://{settings.SUPABASE_URL}/storage/v1/object/public/card_photos/{file_name}"
    
    # DB更新
    supabase.table("cards").update({"photo_url": public_url}).eq("card_id", card_id).execute()
    
    return {"message": "写真を更新しました", "photo_url": public_url}



#写真削除
@router.delete("/cards/{card_id}/photo")
async def delete_card_photo(card_id: str, user_id: str = Depends(get_current_user_id)):
    existing = supabase.table("cards").select("*").eq("card_id", card_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="カードが見つかりません")
    
    if existing.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="削除権限がありません")
    
    photo_url = existing.data[0].get("photo_url")
    if photo_url:
        path = photo_url.split("/object/public/card_photos/")[-1]
        supabase.storage.from_("card_photos").remove([path])
    
    # DBのphoto_urlをNULLに
    supabase.table("cards").update({"photo_url": None}).eq("card_id", card_id).execute()
    
    return {"message": "写真を削除しました"}
