# Wazuh → MongoDB Integration

This script fetches alerts and security events from a Wazuh API and stores them in MongoDB Atlas.

## ⚙️ Configuration

Edit `wazuh_log.py` and set:

- `WAZUH_IP`
- `WAZUH_PORT`
- `TOKEN`
- `MONGO_URI`

Alternatively, use environment variables for security.

## 🚀 How to Use

1. Install requirements:
   ```bash
   pip install requests pymongo urllib3

