from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4
from ...models import Pattern, PatternCreate, GenerationRequest
from ...services.ai_engine import get_engine
import os
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for now
# Static patterns removed as per user request
patterns_db: List[Pattern] = []

async def fetch_vercel_blobs() -> List[Pattern]:
    token = os.environ.get("BLOB_READ_WRITE_TOKEN")
    if not token:
        logger.warning("BLOB_READ_WRITE_TOKEN not set. Skipping Vercel Blob fetch.")
        return []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://blob.vercel-storage.com",
                headers={
                    "Authorization": f"Bearer {token}",
                    "x-api-version": "1"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            blobs = data.get("blobs", [])
            patterns = []
            for blob in blobs:
                # Use URL as ID
                url = blob.get("url")
                download_url = blob.get("downloadUrl")
                # Prefer downloadUrl if available and different? Usually url is fine.
                # But let's use url as id and image_url.
                
                pathname = blob.get("pathname")
                
                if not url or not pathname:
                    continue

                # Create a pattern from the blob
                patterns.append(Pattern(
                    id=url,
                    name=pathname, 
                    name_kanji=pathname,
                    name_romaji=pathname,
                    description="Imported from Vercel Blob",
                    width=8,
                    height=8,
                    image_url=download_url or url, # Use downloadUrl if available
                    grid=[[0 for _ in range(8)] for _ in range(8)]
                ))
            return patterns
    except Exception as e:
        logger.error(f"Failed to fetch Vercel Blobs: {e}")
        # Return a dummy pattern with error details for debugging (only in dev)
        return [Pattern(
             id="error",
             name="Error fetching blobs",
             name_kanji="エラー",
             name_romaji="Error",
             description=str(e),
             width=8,
             height=8,
             image_url="",
             grid=[[0 for _ in range(8)] for _ in range(8)]
        )]

@router.get("/patterns", response_model=List[Pattern])
async def list_patterns():
    # Only return Vercel Blob patterns
    return await fetch_vercel_blobs()

@router.get("/patterns/{id:path}", response_model=Pattern)
async def get_pattern(id: str):
    # Check static patterns
    for p in patterns_db:
        if p.id == id:
            return p
    
    # Check if it looks like a URL (Vercel Blob)
    if id.startswith("http"):
        # Synthesize pattern from URL
        # Extract filename from URL (last part)
        try:
            filename = id.split("/")[-1]
            return Pattern(
                id=id,
                name=filename,
                name_kanji=filename,
                name_romaji=filename,
                description="Imported from Vercel Blob",
                width=8,
                height=8,
                image_url=id,
                grid=[[0 for _ in range(8)] for _ in range(8)]
            )
        except Exception:
            pass # Fallthrough to 404

    raise HTTPException(status_code=404, detail="Pattern not found")

@router.post("/generate")
async def generate_pattern(request: GenerationRequest):
    image_url = request.image_url
    
    # If not provided, check base_pattern_id (if it looks like a URL)
    if not image_url and request.base_pattern_id:
        # Check static db (legacy)
        for p in patterns_db:
             if p.id == request.base_pattern_id:
                  image_url = p.image_url
                  break
        
        # If still not found and looks like URL
        if not image_url and request.base_pattern_id.startswith("http"):
             image_url = request.base_pattern_id
    
    engine = get_engine(request.model_type)
    
    # Call generate with image_url
    generated_image_url = await engine.generate(request.instruction, image_url=image_url)
    
    return {
        "generated_image_url": generated_image_url
    }
