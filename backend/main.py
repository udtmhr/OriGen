from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import patterns

app = FastAPI(title="OriGen API", description="Backend for Weaving Pattern Generator")

# Configure CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patterns.router)

@app.get("/")
async def root():
    return {"message": "Welcome to OriGen API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
