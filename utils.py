import requests
import os

def get_exchange_rates():
    api_key = os.environ.get("OPENEXCHANGERATES_API_KEY", "YOUR_API_KEY")
    base_url = f"https://openexchangerates.org/api/latest.json?app_id={api_key}"
    
    try:
        response = requests.get(base_url)
        data = response.json()
        
        if 'rates' not in data:
            raise KeyError("'rates' key not found in API response")
        
        usd_to_hkd = data['rates'].get('HKD', 7.75)  # Default value if HKD rate is not available
        usd_to_cny = data['rates'].get('CNY', 6.5)   # Default value if CNY rate is not available
        
        return {
            'USD_TO_HKD': usd_to_hkd,
            'USD_TO_CNY': usd_to_cny
        }
    except Exception as e:
        print(f"Error fetching exchange rates: {e}")
        return {
            'USD_TO_HKD': 7.75,  # Fallback value
            'USD_TO_CNY': 6.5    # Fallback value
        }
