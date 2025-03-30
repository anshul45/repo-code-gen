from pathlib import Path
from typing import Dict
from dotenv import load_dotenv
from curie_agent import SimpleAgent
from curie_agent.BaseAgent import BaseAgent


class RoutingAgent:
    """Class to handle the conversation management using the custom Agent class"""

    def __init__(self):
        self.project_details = None
        load_dotenv()
        self.active_sessions: Dict[str, BaseAgent] = {}

    def get_or_create_agent(self, user_id: str) -> BaseAgent:
        """Get existing agent or create new one for the user"""

        if user_id not in self.active_sessions:
            self.project_details = self.cache.get_project_details(user_id)
            print("project details", self.project_details)
            print('parent dir', Path(__file__).resolve().parent.parent)

            self.active_sessions[user_id] = SimpleAgent(
                name='routing_agent',
                model="gemini-2.0-flash",
                instructions=f'''
                You classify the input query into one of the following categories:
                    1. building a new application from scratch
                    2. editing/fixing an existing application
                    3. write code for file name with given description

                If the user query is 1 then return the following JSON format:
                {{
                    "category": "manager_agent"
                }}
                If the user query is 2 then return the following JSON format:
                {{
                    "category": "editor_agent"
                }}
                If the user query is 3 then return the following JSON format:
                {{
                    "category": "coder_agent"
                }}
                '''
                ,
                session_id=user_id,
                client_type='gemini',
            )
        return self.active_sessions[user_id]

    async def generate_files_one_by_one(self, user_input: str, user_id: str):
        """Generate and send files sequentially one by one"""
        agent = self.get_or_create_agent(user_id)

        try:
            thread = await agent.run(user_input, response_format='json')
            return [msg for msg in thread if msg['role'] != 'system']

        except Exception as e:
            print(f"Error generating files: {e}")