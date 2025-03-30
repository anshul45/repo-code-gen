from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from curie.manage_agent import ManagerAgent
from typing import Dict
import json

from curie.coder_agent import CoderAgent
from curie.code_agent_gemini import CoderAgentGemini

app = FastAPI()
coder_agent = CoderAgent()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager_agent = ManagerAgent()


@app.get("/")
def health():
    return {
        "result": "Server running!"
    }


@app.post("/chat")
async def chat(request: Request) -> Dict:
    data = await request.json()
    message = data.get("message")
    user_id = data.get("user_id")
    intent = data.get("intent")

    if not message or not user_id:
        return {"error": "Message and user_id are required"}

    try:
        if intent == "code":
            result = await coder_agent.generate_response(message, user_id)
        else:
            result = await manager_agent.generate_files_one_by_one(message, user_id)

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

            # elif last_message.get('type') == "json-files" and last_message.get('content'):
            #     try:
            #         json_response = json.loads(last_message['content'])
            #         result[-1]['content'] = json_response
            #     except json.JSONDecodeError as e:
            #         print(f"JSON parsing error: {str(e)}")

            elif last_message and last_message.get('type') != "json-files":
                try:

                    json_response = json.loads(last_message['content'])

                    if json_response.get('type') == "code" and json_response.get('message'):
                        result[-1]['content'] = json_response['message']
                        result[-1]['type'] = json_response['type']
                except json.JSONDecodeError as e:
                    pass

        return {
            "result": result
        }
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
