import json
from datetime import datetime, timezone, timedelta

def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)

def parse_date(date_str):
    try:
        # If it ends in Z, replace it with +00:00 so Python can parse it as offset-aware UTC
        if date_str.endswith('Z'):
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        else:
            # If there's no timezone info (e.g. 2026-09-08T12:00:00), force it to be offset-aware (UTC)
            dt = datetime.fromisoformat(date_str)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except ValueError:
        return None

def solve_final_fix():
    listings = load_json("data/listings.json")
    projects = load_json("data/projects.json")
    
    # --- Q7 (Fixed Units): Costliest Project ---
    # We found that price_max is 12.44, which is in Crores, not Rupees.
    # The question asks for price_max_inr (in Rupees), so we multiply by 10,000,000
    costliest = max(projects, key=lambda p: p.get("price_max", 0))
    # Convert Crores to integer Rupees for the final answer
    price_in_rupees = int(float(costliest['price_max']) * 10000000)
    print(f"Q7: costliest_project = {{'project_id': '{costliest['project_id']}', 'price_max_inr': {price_in_rupees}}}")
    
    # --- Q8 (Fixed Timezones): Listings last 7 days ---
    # REFERENCE = 2026-09-10T00:00:00+05:30 (IST)
    ref_time = datetime.fromisoformat("2026-09-10T00:00:00+05:30")
    start_time = ref_time - timedelta(days=7)
    
    recent_count = 0
    timestamps_found = set()
    
    for l in listings:
        dt = parse_date(l.get("posted_at", ""))
        if dt:
            if start_time <= dt < ref_time:
                recent_count += 1
            # Check the raw format to log the discrepancy later
            timestamps_found.add(l.get("posted_at")[-6:]) 
            
    print(f"Q8: listings_last_7_days = {recent_count}")
    # Print the ends of the timestamps. If they aren't all 'Z', the doc lied.
    print(f"Timezone endings found in data: {list(timestamps_found)[:5]}")

    # --- Q10: Projects with wrong listing counts ---
    actual_project_counts = {}
    # According to our earlier finding, the API leaks is_live=False records.
    # We should only count active listings (is_live=True) against a project's total.
    for l in listings:
        if l.get("is_live") is True:
            pid = l.get("project_id")
            if pid:
                actual_project_counts[pid] = actual_project_counts.get(pid, 0) + 1
            
    wrong_count = 0
    for p in projects:
        pid = p.get("project_id")
        stated_count = p.get("total_listings", 0)
        actual_count = actual_project_counts.get(pid, 0)
        
        if stated_count != actual_count:
            wrong_count += 1
            
    print(f"Q10: projects_with_wrong_listing_count = {wrong_count}")

if __name__ == "__main__":
    solve_final_fix()