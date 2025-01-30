from typing import Dict
from dotenv import load_dotenv
from Azent.Azent import Agent
import os
from cache.cache import GlobalCache
from tools import get_file_summary
from opik import track

class ManagerAgent:
    """Class to handle the conversation management using the custom Agent class"""
    
    def __init__(self):
        load_dotenv()
        self.active_sessions: Dict[str, Agent] = {}
        cache = GlobalCache()
    
    @track
    def get_or_create_agent(self, user_id: str) -> Agent:
        """Get existing agent or create new one for the user"""
        if user_id not in self.active_sessions:
            cache = GlobalCache()
            self.project_details = cache.get(user_id)

            self.active_sessions[user_id] = Agent(
                name='manager agent',
                model="gpt-4o",
                instructions=f'''
                You are a highly skilled 100x technical lead and 100x developer which solves and build the task provided to you.
                Your main task is to understand task, code it and based on that you should reply back and call specific tools if needed.
                The code should be clean, well documented and should be able to run without any errors.
                The code would be generated for an existing project.

                The project details are:
                {self.project_details}

                current working directory: 
                {os.getcwd()}
                ''',
                tools=[
                ]
            )
        return self.active_sessions[user_id]

    @track
    def generate_response(self, user_input: str, user_id: str) -> str:
        """Generate response using the manager agent"""
        agent = self.get_or_create_agent(user_id)
        print("agent", agent.name)
        try:
            response = agent.run(user_input)
            exact_response = response.choices[0].message.content
            return exact_response
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your request. Please try again."
    
    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]