import os
from pathlib import Path
from typing import Dict
from dotenv import load_dotenv
import json

from cache.cache import RedisCache
from tools import get_files_with_description
from curie_agent.BaseAgent import BaseAgent


class ManagerAgent:
    """Class to handle the conversation management using the custom Agent class"""

    def __init__(self):
        self.project_details = None
        load_dotenv()
        self.active_sessions: Dict[str, BaseAgent] = {}
        self.cache = RedisCache()

    def get_or_create_agent(self, user_id: str) -> BaseAgent:
        """Get existing agent or create new one for the user"""
        with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/tools/base_template.json') as f:
            base_template = json.load(f)

        if user_id not in self.active_sessions:
            self.project_details = self.cache.get_project_details(user_id)
            print("project details", self.project_details)
            print('parent dir', Path(__file__).resolve().parent.parent)

            self.active_sessions[user_id] = BaseAgent(
                name='manager agent',
                model="gemini-2.0-flash",
                instructions=f'''
                You are a highly skilled 100x software engineer AI chatbot which has knowledge of building most fancy UI project in NextJS app router, typescript, tailwind, and Shadcn UI tech stack.
                Your have two main:
                    1. User ask you to build any application, then, your task is to understand problem statement, and plan out how to build the micro application for the problem statement. You dont write code by yourself, you just plan out things.
                    2. User ask you to edit any existing application, then, your task is to understand problem statement, and plan out how to edit the micro application for the problem statement. You don't create all the files again but just edit the file which is required.
                
                Ask any question if anything is not clear to build the nextjs project.
                Once you have plan ready, call tool <get_files_with_description> to get a list of files and their descriptions for the project.
                You will be provided with tools which you can use to build the task.
                You are provided with base_template for base project structure setup which already exists. this is boilerplate code for the project which is in the json format.
                
                You need to respond with as minimum information as possible to the developer and keep most of the tech knowledge to yourself. don'also mention to use which tools you are using, basically it doesnt understand it.
                [base_template]
                {{base_template}}
                
                Important Notes:
                - The nextjs project base_template uses tailwind.config.ts and app/globals.css files for styling.
                - Keep UI clean, good layout, and minimal button and beautiful.
                - the application starts from from src/app/page.tsx as the main page. for example, if you are cereating a todo app, then the code should start from src/app/page.tsx where the todo app should start.
                - don't add any landing page in the project.
                - Don't use any database, simply CRUD operation stores in the memory data.
                - If possible add sidebar in the project.
                - Don't add many components but application should look good.

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

    async def generate_files_one_by_one(self, user_input: str, user_id: str):
        """Generate and send files sequentially one by one"""
        agent = self.get_or_create_agent(user_id)

        try:
            thread = await agent.run(user_input)
            return [msg for msg in thread if msg['role'] != 'system']

        except Exception as e:
            print(f"Error generating files: {e}")

    async def generate_response_stream(self, user_input: str, user_id: str):
        """Generate streaming response using the manager agent"""
        agent = self
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
