import os
import requests

def get_gold_price():
    api_key = os.environ.get('GOLD_PRICE_API_KEY')
    if not api_key:
        raise ValueError("GOLD_PRICE_API_KEY environment variable is not set")

    # This is a placeholder URL. Replace it with the actual API endpoint
    url = f"https://api.example.com/gold-price?api_key={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data['gold_price']  # Adjust this based on the actual API response structure
    except requests.RequestException as e:
        print(f"Error fetching gold price: {e}")
        return None
