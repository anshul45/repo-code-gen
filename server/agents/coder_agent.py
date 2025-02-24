import os

from server.Azent.Azent import Agent


class CoderAgent:
    def __init__(self):
        self.active_sessions = {}

    def get_or_create_agent(self, user_id: str) -> Agent:
        """Get existing agent or create new one for the user"""
        
        if user_id not in self.active_sessions:

            agent = Agent(
                name='coder_agent',
                model="claude-3-5-sonnet-20241022",
                instructions=f'''
                    You are a highly skilled 100x developer which solves and build the task provided to you in Next.js typescript, Shadcn UI, and Tailwind CSS in a very efficient way.
                    You will be provided with the file name, file path, and description of the task. Your main task is to understand task, and write code to solve the task.
                    You will be provided with tools which you can use to build the task.

                    Structure the output in JSON format like this:
                    <code>
                        <file_name>todo.tsx </file_name>
                        <file_name>src/app/todo.tsx </file_name>
                        <code> </code>
                        <description> </description>
                    </code>
                    ''',
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
