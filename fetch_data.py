import requests
import json
import os

API_KEY = "IVY26-A78847D9979E"
BASE_URL = "https://solve.ivy.homes"
EMAIL = "demo1@ivy.homes"
PASSWORD = "58b2525506"

# Create a data directory
os.makedirs("data", exist_ok=True)

class IvyClient:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None

    def login(self):
        print("Logging in...")
        res = requests.post(
            f"{BASE_URL}/auth/login",
            headers={"X-API-Key": API_KEY},
            json={"email": EMAIL, "password": PASSWORD}
        )
        res.raise_for_status()
        data = res.json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]

    def refresh(self):
        print("Refreshing token...")
        res = requests.post(
            f"{BASE_URL}/auth/refresh",
            headers={"X-API-Key": API_KEY},
            json={"refresh_token": self.refresh_token}
        )
        if res.status_code != 200:
            print("Refresh failed, re-logging in...")
            return self.login()
        data = res.json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]

    def request(self, method, endpoint, params=None, **kwargs):
        if not self.access_token:
            self.login()
        
        url = f"{BASE_URL}{endpoint}"
        headers = {
            "X-API-Key": API_KEY,
            "Authorization": f"Bearer {self.access_token}"
        }
        
        res = requests.request(method, url, headers=headers, params=params, **kwargs)
        if res.status_code == 401:
            self.refresh()
            headers["Authorization"] = f"Bearer {self.access_token}"
            res = requests.request(method, url, headers=headers, params=params, **kwargs)
            
        res.raise_for_status()
        return res.json()

    def fetch_all(self, endpoint, filename):
        print(f"\nFetching all records for {endpoint}...")
        all_records = []
        limit = 200 # Max limit per the docs
        offset = 0
        has_more = True
        
        while has_more:
            # Note: API uses offset, not page!
            res = self.request("GET", endpoint, params={"limit": limit, "offset": offset})
            results = res.get("results", [])
            all_records.extend(results)
            
            offset += limit
            has_more = res.get("has_more", False)
            print(f"Downloaded {len(all_records)} / {res.get('total', '??')} records")
            
        filepath = f"data/{filename}"
        with open(filepath, "w") as f:
            json.dump(all_records, f, indent=2)
        print(f"Saved to {filepath}")

if __name__ == "__main__":
    client = IvyClient()
    client.fetch_all("/v1/listings", "listings.json")
    client.fetch_all("/v1/rentals", "rentals.json")
    client.fetch_all("/v1/projects", "projects.json")
    
    print("\nData extraction complete! You are ready for Phase 2.")