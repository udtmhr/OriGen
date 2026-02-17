from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

class PatternBase(BaseModel):
    name: str
    description: Optional[str] = None
    width: int
    height: int
    image_url: Optional[str] = None
    name_kanji: Optional[str] = None
    name_romaji: Optional[str] = None

class PatternCreate(PatternBase):
    grid: List[List[int]]

class Pattern(PatternBase):
    id: str
    grid: List[List[int]]
    created_at: Optional[str] = None

class GenerationRequest(BaseModel):
    base_pattern_id: Optional[str] = None
    instruction: str
    model_type: str = "api" # 'api' or 'gemini'
    image_url: Optional[str] = None
