#!/usr/bin/env python3
import requests
import sys
import os

# Configuration
API_URL = "http://localhost:5000/api/landingpages"
ZIP_FILE = r"c:\Users\PC\Documents\code\ladifinal\phu-hieu-xe.zip"
SUBDOMAIN = "phu-hieu-xe"

def upload_landing_page():
    """Upload landing page ZIP file to the system"""
    
    # Check if file exists
    if not os.path.exists(ZIP_FILE):
        print(f"❌ File not found: {ZIP_FILE}")
        return False
    
    # Get file size
    file_size = os.path.getsize(ZIP_FILE)
    print(f"📦 File size: {file_size / 1024 / 1024:.2f} MB")
    
    # Read ZIP file
    with open(ZIP_FILE, 'rb') as f:
        files = {'file': f}
        data = {
            'subdomain': SUBDOMAIN,
            'page_type': 'landing'
        }
        
        try:
            print(f"📤 Uploading to {API_URL}...")
            response = requests.post(API_URL, files=files, data=data, timeout=60)
            
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code in [200, 201]:
                print("✅ Upload successful!")
                print(f"🌐 Landing page available at: http://127.0.0.1:5000/landing/{SUBDOMAIN}")
                return True
            else:
                print(f"❌ Upload failed with status {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection error - is the Flask app running?")
            return False
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return False

if __name__ == "__main__":
    success = upload_landing_page()
    sys.exit(0 if success else 1)
