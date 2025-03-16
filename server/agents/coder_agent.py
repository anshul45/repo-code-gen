import json
import os

from Azent.Azent import Agent


class CoderAgent:
    def __init__(self):
        self.active_sessions = {}

    def get_or_create_agent(self, user_id: str) -> Agent:
        """Get existing agent or create new one for the user"""
        
        if user_id not in self.active_sessions:

            with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/tools/base_template_project_structure.json') as f:
                base_template = json.load(f)

            agent = Agent(
                name='coder_agent',
                model="claude-3-5-sonnet-20241022",
                instructions=f'''
                    You are a highly skilled 100x developer which solves and build the task provided to you in Next.js typescript, Shadcn UI, and Tailwind CSS in a very efficient way.
                    You will be provided with the file name, file path, and description of the task and the overall plan for a micro application. 
                    Your main task is to understand task, and write code to solve the task.
                    You will be provided with base_template for base project structure setup which already exists.
                    
                    [base_template]
                    {{base_template}}

                    Structure of the output in JSON format like this for a UI page:
                    <code>
                        <file_name>app/directory/todo/directory/todo.tsx </file_name>
                        <code> </code>
                        <description> </description>
                    </code>
                    
                    OR for a API file:
                    <code>
                        <file_name>app/api/directory/chat/directory/route.ts </file_name>
                        <code> </code>
                        <description> </description>
                    </code>
                    '''.replace('{base_template}', json.dumps(base_template)),
                base_url="https://api.anthropic.com/v1/messages",
                api_key=os.getenv('ANTHROPIC_API_KEY'),
                temperature=0.6,
                session_id=user_id,
                client_type='anthropic'
            )
            self.active_sessions[user_id] = agent
            return agent

        return self.active_sessions[user_id]
    
    def generate_response(self, user_input: str, user_id: str):
        agent = self.get_or_create_agent(user_id)
        try:
            thread = agent.run(user_input)
            return [msg for msg in thread if msg['role'] != 'system']
        except Exception as e:
            print(e)
            return [{"role": "assistant", "content": "Something went wrong, please try again later"}]
