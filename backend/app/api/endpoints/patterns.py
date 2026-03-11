from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4
from ...models import Pattern, PatternCreate, GenerationRequest
from ...services.ai_engine import get_engine
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate")
async def generate_pattern(request: GenerationRequest):
    image_url = request.image_url
    
    # If not provided, check base_pattern_id (if it looks like a URL)
    if not image_url and request.base_pattern_id:
        if request.base_pattern_id.startswith("http"):
             image_url = request.base_pattern_id
    
    engine = get_engine(request.model_type)
    
    # Call generate with image_url
    generated_image_url = await engine.generate(request.instruction, image_url=image_url)
    
    return {
        "generated_image_url": generated_image_url
    }
