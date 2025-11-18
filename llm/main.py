from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm_client import generate_card
from models import CardNode
from dotenv import load_dotenv

load_dotenv()

class GenerateCardRequest(BaseModel):
    query: str


app = FastAPI(title="AI Adaptive Card API", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate-card", response_model=CardNode)
def generate_card_endpoint(payload: GenerateCardRequest) -> Any:
    try:
        card = generate_card(payload.query)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return card


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
