from fastapi import APIRouter, HTTPException, status, Depends, Header,Response
from typing import Optional, Dict, Any
from app.db.supabase import supabase
from app.schemas.auth_schema import SignupRequest, LoginRequest


router = APIRouter()

# --- トークン検証 ---
async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.removeprefix("Bearer ").strip()

    try:
        user = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auth service error: {str(e)}")

    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user.user


# --- 新規登録 ---
@router.post("/signup")
async def signup(request: SignupRequest):
    try:
        result = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })

        if not result.user:
            raise HTTPException(status_code=400, detail="登録に失敗しました")

        
        """supabase.table("users_app").insert({
            "user_id": result.user.id,
            "email": request.email
        }).execute()"""

        return {"message": "登録完了。確認メールを確認してください。"}
        #メールの送信までもSupabaseが行ってくれる
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sign-up failed: {str(e)}")


# --- ログイン ---
@router.post("/login")
async def login(request: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })

        if not response.user:
            raise HTTPException(status_code=401, detail="メールまたはパスワードが違います")

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


# --- 自分の情報取得 ---
@router.get("/me")
async def get_user_info(user: Dict[str, Any] = Depends(get_current_user)):
    return {"id": user["id"], "email": user["email"]}