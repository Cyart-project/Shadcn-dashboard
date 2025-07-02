import requests
import urllib3
import time
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

# ------------------ CONFIGURATION ------------------
WAZUH_HOST = "https://100.66.240.63"
WAZUH_PORT = 55000
USERNAME = "wazuh-wui"
PASSWORD = "wazuh-wui"

MONGODB_URI = "mongodb+srv://cyartproject:Projectadmin@cyartdb.nukbmia.mongodb.net/?retryWrites=true&w=majority&appName=CyartDB"
DB_NAME = "siem_logs"
COLLECTION_NAME = "wazuh_manager_logs"

FETCH_LIMIT = 100  # Number of logs per request
FETCH_INTERVAL = 10  # Seconds between fetches (for continuous fetch)
# ----------------------------------------------------

# Disable SSL warnings
urllib3.disable_warnings()

# ------------------ MONGODB SETUP -------------------
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Optional: Create a unique index on timestamp + description to avoid duplicates
collection.create_index([("timestamp", 1), ("description", 1)], unique=True)

# ------------------ TOKEN FETCH ---------------------
def get_token():
    url = f"{WAZUH_HOST}:{WAZUH_PORT}/security/user/authenticate"
    response = requests.get(url, auth=(USERNAME, PASSWORD), verify=False)
    response.raise_for_status()
    token = response.json()["data"]["token"]
    print("[+] Token acquired.")
    return token

# ------------------ LOG FETCH -----------------------
def fetch_logs(token, offset=0, limit=100):
    url = f"{WAZUH_HOST}:{WAZUH_PORT}/manager/logs?offset={offset}&limit={limit}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, verify=False)
    if response.status_code == 200:
        data = response.json().get("data", {})
        return data.get("affected_items", []), data.get("total_affected_items", 0)
    else:
        print(f"[!] Error: {response.status_code} {response.reason}")
        return [], 0

# ------------------ MAIN LOOP -----------------------
def main():
    token = get_token()
    offset = 0

    while True:
        logs, total = fetch_logs(token, offset=offset, limit=FETCH_LIMIT)

        if not logs:
            print("[+] No more logs to fetch.")
            break

        new_logs = 0
        for log in logs:
            try:
                collection.insert_one(log)
                new_logs += 1
            except DuplicateKeyError:
                pass  # Skip already inserted logs

        print(f"[+] Fetched {len(logs)} logs, {new_logs} new added to MongoDB.")
        offset += len(logs)

        if offset >= total:
            print("[✓] All logs fetched. Waiting before next poll...")
            offset = 0
            time.sleep(FETCH_INTERVAL)

if __name__ == "__main__":
    main()

