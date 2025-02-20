from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any, AsyncGenerator
from agents.manage_agent import ManagerAgent

app = FastAPI()

# Initialize the manager agent
manager_agent = ManagerAgent()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    response: str
    additional_data: Dict[str, Any] = {}

@app.get("/")
async def root():
    return {"status": "ok", "message": "Manager Agent API is running"}

async def stream_response(message: str, user_id: str) -> AsyncGenerator[str, None]:
    """Stream the response in SSE format"""
    async for chunk in manager_agent.generate_response_stream(message, user_id):
        yield f"data: {chunk}\n\n"

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        return StreamingResponse(
            stream_response(request.message, request.user_id),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
