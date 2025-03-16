import os
from pathlib import Path
from typing import Dict
from dotenv import load_dotenv
import json

from Azent.Azent import Agent
from cache.cache import RedisCache
from tools import get_files_with_description


class ManagerAgent:
    """Class to handle the conversation management using the custom Agent class"""

    def __init__(self):
        load_dotenv()
        self.active_sessions: Dict[str, Agent] = {}
        self.cache = RedisCache()

    def get_or_create_agent(self, user_id: str) -> Agent:
        """Get existing agent or create new one for the user"""
        with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/tools/base_template.json') as f:
            base_template = json.load(f)

        if user_id not in self.active_sessions:
            self.project_details = self.cache.get_project_details(user_id)
            print("project details", self.project_details)
            print('parent dir', Path(__file__).resolve().parent.parent)

            self.active_sessions[user_id] = Agent(
                name='manager agent',
                model="gemini-2.0-flash",
                instructions=f'''
                You are a highly skilled 100x software engineer which builds project in NextJS app router, typescript, tailwind, and Shadcn UI tech stack.
                Ask any question if anything is not clear to build the nextjs project.
                Your main task is to understand problem statement and call tool <get_files_with_description> to get a list of files and their descriptions for the project.
                You will be provided with tools which you can use to build the task.
                You are provided with base_template for base project structure setup which already exists. this is boilerplate code for the project which is in the json format.
                
                [base_template]
                {{base_template}}

                Available tools are:
                    - <get_files_with_description> : This tool will return the list of files which needs to be created or updated in the project.
                '''.replace('{base_template}', json.dumps(base_template)),
                session_id=user_id,
                tools=[
                    get_files_with_description
                ],
                client_type='gemini'
            )
        return self.active_sessions[user_id]

    def generate_files_one_by_one(self, user_input: str, user_id: str):
        """Generate and send files sequentially one by one"""
        agent = self.get_or_create_agent(user_id)

        try:
            thread = agent.run(user_input)
            return [msg for msg in thread if msg['role'] != 'system']

        except Exception as e:
            print(f"Error generating files: {e}")

    async def generate_response_stream(self, user_input: str, user_id: str):
        """Generate streaming response using the manager agent"""
        agent = self.get_or_create_agent(user_id)
        print("agent", agent.name)
        try:
            response = agent.run(user_input, stream=True)
            for chunk in response:
                if hasattr(chunk.choices[0], 'delta'):
                    # Handle regular content
                    if chunk.choices[0].delta.content:
                        yield f"data: {chunk.choices[0].delta.content}\n\n"

                    # Handle tool calls
                    if chunk.choices[0].delta.tool_calls:
                        for tool_call in chunk.choices[0].delta.tool_calls:
                            try:
                                result = agent.execute_tool_call(tool_call, agent.tools_map)
                                yield f"data: \nTool Result: {json.dumps(result)}\n\n"
                            except Exception as tool_error:
                                print(f"Tool execution error: {tool_error}")
                                yield f"data: \nError executing tool: {str(tool_error)}\n\n"

                elif hasattr(chunk.choices[0], 'message'):
                    # Handle non-streaming responses (like tool results)
                    if chunk.choices[0].message.content:
                        yield f"data: {chunk.choices[0].message.content}\n\n"

            # Send a final newline to ensure the last message is flushed
            yield "data: \n\n"

        except Exception as e:
            print(f"Error generating response: {e}")
            yield f"data: Error: {str(e)}\n\n"

    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]
