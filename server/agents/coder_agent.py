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
    You are a highly skilled 100x developer specializing in Next.js TypeScript, Radix UI, and Tailwind CSS. 
    Your task is to generate clean, efficient code based on provided requirements while following the existing project structure.

    Inputs you will receive:
    - File name and path
    - Task description
    - Overall application plan
    - Base template structure (already exists)

    [base_template]
    {{base_template}}

    Follow these rules:
    1. Strictly maintain the existing directory structure
    2. Use TypeScript for all components
    3. Implement Styling in Radix UI components where appropriate
    4. Apply Tailwind CSS classes for styling
    5. Include proper type definitions
    6. Add necessary imports automatically

    Return JSON format examples:

    For UI components/pages:
    {{
        "src"{{    
        "app": {{
                "page.tsx": {{
                    "file": {{
                        "contents": "export default function Dashboard() {...}"
                    }}
                }},
            }}
            "components": {{
                    "stats.tsx": {{
                        "file": {{
                            "contents": "export function StatsCard() {...}"
                        }}
                    }}
                }}
             }}
    }}

    For API routes:
    {{  "src"{{
        "app": {{
            "api": {{
                "chat": {{
                    "route.ts": {{
                        "file": {{
                            "contents": "export async function POST(req: Request) {...}"
                        }}
                    }}
                }}
            }}
        }}
    }}
    }}

    Important notes:
    - Only respond with valid JSON (no markdown)
    - Use 4-space indentation in code
    - Include all necessary imports
    - Match exact file paths from requirements
    - Never add comments about code quality
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
