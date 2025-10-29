# Gamyo.ai AI Microservice

FastAPI-based AI microservice for content generation, translation, and image creation.

## Features

- **Caption Generation**: AI-powered social media captions with customizable tone and language
- **Hashtag Generation**: Relevant hashtag suggestions based on content
- **Image Generation**: DALL-E powered image creation
- **Translation**: Multi-language translation support
- **Content Enhancement**: AI-driven content improvements

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `AI_SERVICE_API_KEY`: Secret key for authenticating backend requests

### 3. Run the Service

**Development:**
```bash
python main.py
```

**Production:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Docker:**
```bash
docker build -t gamyo-ai-service .
docker run -p 8000:8000 --env-file .env gamyo-ai-service
```

## API Endpoints

### Health Check
```
GET /health
```

### Generate Caption
```
POST /api/ai/generate-caption
Content-Type: application/json
X-API-Key: your-api-key

{
  "prompt": "Write a post about sustainable fashion",
  "tone": "professional",
  "language": "en"
}
```

### Generate Hashtags
```
POST /api/ai/generate-hashtags
Content-Type: application/json
X-API-Key: your-api-key

{
  "content": "Your post content here",
  "count": 5
}
```

### Generate Image
```
POST /api/ai/generate-image
Content-Type: application/json
X-API-Key: your-api-key

{
  "prompt": "A modern office workspace with plants",
  "size": "1024x1024"
}
```

### Translate Text
```
POST /api/ai/translate
Content-Type: application/json
X-API-Key: your-api-key

{
  "text": "Hello, world!",
  "target_language": "hi",
  "source_language": "en"
}
```

### Enhance Content
```
POST /api/ai/enhance-content
Content-Type: application/json
X-API-Key: your-api-key

{
  "content": "Your content here",
  "improvements": ["grammar", "engagement"]
}
```

## Integration with Sails.js Backend

The backend communicates with this microservice through the `AiService.js` service:

```javascript
const result = await AiService.generateCaption('Generate a post about...', 'professional', 'en');
```

## Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

