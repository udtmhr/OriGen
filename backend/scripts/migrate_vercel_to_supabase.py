import os
import requests
import vercel_blob
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env variables
load_dotenv('.env')

# Supabase init
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
if not url or not key:
    print("SUPABASE_URL and SUPABASE_KEY must be set in .env")
    exit(1)

supabase: Client = create_client(url, key)

def main():
    print("Fetching vercel blobs...")
    resp = vercel_blob.list()
    blobs = resp.get("blobs", []) if isinstance(resp, dict) else resp
    
    for blob in blobs:
        if isinstance(blob, dict):
            download_url = blob.get("downloadUrl") or blob.get("url")
            pathname = blob.get("pathname")
        else:
            download_url = getattr(blob, "downloadUrl", getattr(blob, "url", None))
            pathname = getattr(blob, "pathname", None)
            
        if not download_url or not pathname:
            continue
            
        print(f"Processing pattern: {pathname}")
        
        # Download image from Vercel
        print(f"  - Downloading from {download_url}")
        res = requests.get(download_url)
        if res.status_code != 200:
            print(f"  - Failed to download {pathname}")
            continue

        file_content = res.content
        
        # Determine content type (usually png or webp for patterns)
        # default to png if not sure
        content_type = "image/png"
        if pathname.endswith(".webp"):
            content_type = "image/webp"
            
        # Upload to Supabase Storage
        file_path = f"legacy/{pathname}"
        print(f"  - Uploading to Supabase Storage as {file_path}")
        try:
            supabase.storage.from_("patterns").upload(file_path, file_content, file_options={"content-type": content_type, "upsert": "true"})
        except Exception as e:
            print(f"  - Storage upload error: {e}")
            
        # Insert metadata into db
        supabase_image_url = f"{url}/storage/v1/object/public/patterns/{file_path}"
        
        print(f"  - Inserting record to db")
        try:
            data, count = supabase.table("patterns").insert({
                "name": pathname,
                "description": "Imported from Vercel Blob",
                "image_url": supabase_image_url,
                "is_public": True,
                "width": 8,
                "height": 8
            }).execute()
        except Exception as e:
            print(f"  - DB insert error: {e}")
            
    print("Migration finished!")

if __name__ == "__main__":
    main()
