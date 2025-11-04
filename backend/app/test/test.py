from app.routers  import cardlink_create_router
from app.routers  import auth_router
import requests

url = "http://localhost:8000/api/auth/signup"
data = {
    "email": "harry906skmt@gmail.com",
    "password": "StrongManManMan"
}

resp = requests.post(url, json=data)
print(resp.json())
