"""
FastAPI AI Microservice for Gamyo.ai
Provides AI-powered content generation, translation, and image creation
"""

import os
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import openai
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Gamyo.ai AI Microservice",
    description="AI-powered content generation for social media",
    version="2.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

# API Key verification
API_KEY = os.getenv("AI_SERVICE_API_KEY", "")


# Dependency for API key verification
async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key


# ============================================
# Request/Response Models
# ============================================

class CaptionRequest(BaseModel):
    prompt: str
    tone: str = "professional"
    language: str = "en"


class CaptionResponse(BaseModel):
    success: bool
    caption: str


class HashtagRequest(BaseModel):
    content: str
    count: int = 5


class HashtagResponse(BaseModel):
    success: bool
    hashtags: List[str]


class ImageRequest(BaseModel):
    prompt: str
    size: str = "1024x1024"


class ImageResponse(BaseModel):
    success: bool
    image_url: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str
    source_language: str = "en"


class TranslateResponse(BaseModel):
    success: bool
    translated_text: str


class EnhanceRequest(BaseModel):
    content: str
    improvements: List[str] = ["grammar", "engagement"]


class EnhanceResponse(BaseModel):
    success: bool
    enhanced_content: str
    suggestions: List[str]


# ============================================
# Routes
# ============================================

@app.get("/")
async def root():
    return {
        "service": "Gamyo.ai AI Microservice",
        "version": "2.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openai_configured": bool(openai.api_key),
    }


@app.post("/api/ai/generate-caption", response_model=CaptionResponse)
async def generate_caption(
    request: CaptionRequest,
    api_key: str = Depends(verify_api_key)
):
    """Generate a social media caption using AI"""
    try:
        logger.info(f"Generating caption with tone: {request.tone}, language: {request.language}")

        # Create prompt based on tone and language
        system_prompt = f"""You are a social media content expert. 
        Generate a {request.tone} caption in {request.language} language.
        The caption should be engaging, concise, and suitable for social media platforms."""

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt},
            ],
            max_tokens=200,
            temperature=0.7,
        )

        caption = response.choices[0].message.content.strip()

        return CaptionResponse(success=True, caption=caption)

    except Exception as e:
        logger.error(f"Error generating caption: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ai/generate-hashtags", response_model=HashtagResponse)
async def generate_hashtags(
    request: HashtagRequest,
    api_key: str = Depends(verify_api_key)
):
    """Generate relevant hashtags for content"""
    try:
        logger.info(f"Generating {request.count} hashtags")

        system_prompt = f"""You are a social media hashtag expert.
        Generate {request.count} relevant, popular hashtags for the given content.
        Return only the hashtags, separated by spaces, with # prefix."""

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.content},
            ],
            max_tokens=100,
            temperature=0.5,
        )

        hashtags_text = response.choices[0].message.content.strip()
        hashtags = [tag.strip() for tag in hashtags_text.split() if tag.startswith('#')]

        return HashtagResponse(success=True, hashtags=hashtags[:request.count])

    except Exception as e:
        logger.error(f"Error generating hashtags: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ai/generate-image", response_model=ImageResponse)
async def generate_image(
    request: ImageRequest,
    api_key: str = Depends(verify_api_key)
):
    """Generate an image using DALL-E"""
    try:
        logger.info(f"Generating image with size: {request.size}")

        response = openai.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            size=request.size,
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url

        return ImageResponse(success=True, image_url=image_url)

    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ai/translate", response_model=TranslateResponse)
async def translate_text(
    request: TranslateRequest,
    api_key: str = Depends(verify_api_key)
):
    """Translate text to target language"""
    try:
        logger.info(f"Translating from {request.source_language} to {request.target_language}")

        system_prompt = f"""You are a professional translator.
        Translate the following text from {request.source_language} to {request.target_language}.
        Maintain the tone and style of the original text."""

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.text},
            ],
            max_tokens=500,
            temperature=0.3,
        )

        translated_text = response.choices[0].message.content.strip()

        return TranslateResponse(success=True, translated_text=translated_text)

    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ai/enhance-content", response_model=EnhanceResponse)
async def enhance_content(
    request: EnhanceRequest,
    api_key: str = Depends(verify_api_key)
):
    """Enhance content with AI suggestions"""
    try:
        logger.info(f"Enhancing content with improvements: {request.improvements}")

        improvements_text = ", ".join(request.improvements)
        system_prompt = f"""You are a content improvement expert.
        Enhance the following content by improving: {improvements_text}.
        Return the enhanced content and a list of 3-5 specific improvements made."""

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.content},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        result = response.choices[0].message.content.strip()
        
        # Parse the response (assuming format: enhanced content, then list of improvements)
        parts = result.split("\n\n", 1)
        enhanced_content = parts[0]
        suggestions = parts[1].split("\n") if len(parts) > 1 else []

        return EnhanceResponse(
            success=True,
            enhanced_content=enhanced_content,
            suggestions=suggestions,
        )

    except Exception as e:
        logger.error(f"Error enhancing content: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# Run the application
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )

