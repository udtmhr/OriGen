from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4
from ...models import Pattern, PatternCreate, GenerationRequest
from ...services.ai_engine import get_engine

router = APIRouter()

# In-memory storage for now
patterns_db: List[Pattern] = [
    Pattern(
        id="1",
        name="Hikari-ji",
        name_kanji="光路",
        name_romaji="Hikari-ji",
        description="Light path pattern",
        width=8,
        height=8,
        image_url="https://placehold.co/400x400/e2e8f0/1e293b?text=Hikari-ji", # Placeholder
        grid=[[((r+c)%2) for c in range(8)] for r in range(8)]
    ),
    Pattern(
        id="2",
        name="Haneiro",
        name_kanji="羽彩",
        name_romaji="Haneiro",
        description="Feather color pattern",
        width=8,
        height=8,
        image_url="https://placehold.co/400x400/e2e8f0/1e293b?text=Haneiro", # Placeholder
        grid=[[((r)%2) for c in range(8)] for r in range(8)]
    ),
    Pattern(
        id="3",
        name="Flower",
        name_kanji="花",
        name_romaji="Hana",
        description="Flower pattern",
        width=8,
        height=8,
        image_url="https://placehold.co/400x400/e2e8f0/1e293b?text=Hana", # Placeholder
        grid=[[((c)%2) for c in range(8)] for r in range(8)]
    ),
    Pattern(
        id="4",
        name="Stripe",
        name_kanji="縞",
        name_romaji="Shima",
        description="Stripe pattern",
        width=8,
        height=8,
        image_url="https://placehold.co/400x400/e2e8f0/1e293b?text=Shima", # Placeholder
        grid=[[0 for c in range(8)] for r in range(8)]
    )
]

@router.get("/patterns", response_model=List[Pattern])
async def list_patterns():
    return patterns_db

@router.get("/patterns/{id}", response_model=Pattern)
async def get_pattern(id: str):
    for p in patterns_db:
        if p.id == id:
            return p
    raise HTTPException(status_code=404, detail="Pattern not found")

@router.post("/generate")
async def generate_pattern(request: GenerationRequest):
    # Retrieve base pattern if ID is provided
    base_grid = request.current_grid
    if not base_grid and request.base_pattern_id:
         for p in patterns_db:
            if p.id == request.base_pattern_id:
                base_grid = p.grid
                break
    
    if not base_grid:
        # Default 8x8 empty if nothing provided
        base_grid = [[0]*8 for _ in range(8)]

    engine = get_engine(request.model_type)
    new_grid = await engine.generate(base_grid, request.instruction)
    
    return {"grid": new_grid}
