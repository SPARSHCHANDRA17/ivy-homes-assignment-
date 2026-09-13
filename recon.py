import requests
import json

API_KEY = "IVY26-A78847D9979E"
BASE_URL = "https://solve.ivy.homes"
EMAIL = "demo1@ivy.homes"
PASSWORD = "58b2525506"

def print_json(data):
    print(json.dumps(data, indent=2))

def run_recon():
    print("--- 3. Logging in ---")
    login_payload = {"email": EMAIL, "password": PASSWORD}
    headers = {"X-API-Key": API_KEY, "Content-Type": "application/json"}
    
    login_res = requests.post(f"{BASE_URL}/auth/login", json=login_payload, headers=headers)
    print(f"Login Status: {login_res.status_code}")
    print("Raw Login Response:")
    print_json(login_res.json())
    
    if login_res.status_code != 200:
        return
        
    token_data = login_res.json()
    # Try to dynamically catch it if they named it something standard like access_token
    token = token_data.get("token") or token_data.get("access_token") 
    
    if not token:
        print("\nERROR: Could not find the token. We need to check the Raw Login Response above.")
        return
    
    print(f"\nExtracted Token: {token[:10]}... (truncated)")
    
    print("\n--- 4. Testing /v1/listings Pagination ---")
    auth_headers = {
        "X-API-Key": API_KEY,
        "Authorization": f"Bearer {token}"
    }
    
    listings_res = requests.get(f"{BASE_URL}/v1/listings?limit=2&page=1", headers=auth_headers)
    print(f"Listings Status: {listings_res.status_code}")
    
    data = listings_res.json()
    
    if "results" in data:
        data["results"] = f"[{len(data['results'])} items hidden for brevity]"
    elif "data" in data:
         data["data"] = f"[{len(data['data'])} items hidden for brevity]"
         
    print_json(data)

if __name__ == "__main__":
    run_recon()