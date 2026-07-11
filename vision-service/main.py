"""
Local AI Vision microservice for e-commerce product auto-fill.
Loads moondream2 (1.86B params) — runs on CPU, no GPU required.
"""

import base64
import io
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Vision Product Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_model = None


class AnalyzeRequest(BaseModel):
    image: str


class AnalyzeResponse(BaseModel):
    title: str
    category: str


def load_model():
    global _model
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    model_id = "vikhyatk/moondream2"
    revision = "2025-01-09"

    logger.info("Loading moondream2 tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_id, revision=revision)

    logger.info("Loading moondream2 model (CPU, ~3.7 GB RAM)...")
    _model = AutoModelForCausalLM.from_pretrained(
        model_id,
        revision=revision,
        torch_dtype=torch.float32,
        trust_remote_code=True,
    )

    logger.info("Model loaded successfully")


@app.on_event("startup")
def startup():
    try:
        load_model()
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        logger.error("The /analyze endpoint will return 503 until the model loads.")


@app.get("/health")
def health():
    if _model is None:
        return {"status": "loading"}
    return {"status": "ready"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_image(req: AnalyzeRequest):
    if _model is None:
        raise HTTPException(status_code=503, detail="Model is still loading, try /health first")

    try:
        raw = req.image
        if "," in raw:
            raw = raw.split(",", 1)[1]
        image_bytes = base64.b64decode(raw)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        logger.info(f"Image decoded: {image.size}")

        result = _model.query(
            image,
            "Describe the main object in this image. "
            "Write a short, specific e-commerce product title. "
            "Include any visible brand name. "
            "Be concise and accurate. "
            "Do not start with 'A' or 'An'.",
        )
        title = result["answer"].strip().rstrip(".")
        logger.info(f"Generated title: {title}")

        cat_result = _model.query(
            image,
            "What is the single best e-commerce category for this product? "
            "Answer with exactly one word (e.g., Electronics, Clothing, Furniture, Beauty, Sports).",
        )
        category = cat_result["answer"].strip().rstrip(".")
        logger.info(f"Generated category: {category}")

        return AnalyzeResponse(title=title, category=category)

    except Exception as e:
        logger.exception("Analysis failed")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
