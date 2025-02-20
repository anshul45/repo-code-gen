from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agents.manage_agent import ManagerAgent
from typing import Dict
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager_agent = ManagerAgent()

@app.post("/chat")
async def chat(request: Request) -> Dict:
    data = await request.json()
    message = data.get("message")
    user_id = data.get("user_id")

    if not message or not user_id:
        return {"error": "Message and user_id are required"}

    try:
        result = manager_agent.generate_files_one_by_one(message, user_id)

        if result:
            last_message = result[-1]

            if last_message.get('type') == "json" and last_message.get('content'):
                try:
                    json_response = json.loads(last_message['content'])
                    result[-1]['content'] = json_response
                except json.JSONDecodeError as e:
                    print(f"JSON parsing error: {str(e)}")
                    pass

            elif last_message.get('type') == "json-button" and last_message.get('content'):
                try:
                    json_response = json.loads(last_message['content'])
                    result[-1]['content'] = json_response
                except json.JSONDecodeError as e:
                    print(f"JSON parsing error: {str(e)}")

        return {
            "result": result  # Changed from "response" to "result"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
