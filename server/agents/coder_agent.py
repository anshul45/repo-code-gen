import json
import os
from curie_agent.BaseAgent import BaseAgent


class CoderAgent:
    def __init__(self):
        self.active_sessions = {}

    def get_or_create_agent(self, user_id: str) -> BaseAgent:
        """Get existing agent or create new one for the user"""
        
        if user_id not in self.active_sessions:

            with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/tools/base_template_project_structure.json') as f:
                base_template = json.load(f)

            agent = BaseAgent(
                name='coder_agent',
                model="claude-3-5-sonnet-20241022",
                instructions=f'''
    You are a highly skilled AI who is 100x developer specializing in building software application using Next.js TypeScript, Radix UI, and Tailwind CSS. 
    Your task is to generate the fanciest application you can generate. Best looking application, clean, efficient code based on provided requirements while following the existing project structure.

    Inputs you will receive:
    - File name and path
    - Task description
    - Overall application plan
    - Base template structure (already exists)

    [base_template]
    {{base_template}}

    Follow these rules:
    1. Strictly maintain the existing directory structure
    2. The base_template uses tailwind.config.ts and app/globals.css files for styling.
    2. Don't use any database, simply CRUD operation stores in the memory data.
    3. Use TypeScript for all components
    5. Make the UI design clean, smaller button and beautiful.
    6. Use lucid-react for icons.
    7. Apply Tailwind CSS classes for styling
    8. Include proper type definitions
    9. Add necessary imports automatically
    10. use this url for images https://picsum.photos/200/300?random=1, can you use random images in UI.
    11. add any new package in package.json file.
    12. add json file in src/data folder.
    13. don't add metadata in layout.tsx file.

    Return JSON format examples:

    For UI components/pages:
    {{
        "src"{{ 
            "directory":{{
                "app": {{
                    "directory":{{
                            "page.tsx": {{
                                     "file": {{
                                            "contents": "export default function Dashboard() {...}"
                                               }}
                                         }},
                               }}
                          }}
                "components": {{
                    "directory":{{
                            "stats.tsx": {{
                                    "file": {{
                                            "contents": "export function StatsCard() {...}"
                                              }}
                                         }}
                                 }}
                            }}
                        }}
            }}
    }}  
    For API routes:
    {{  "src"{{
        "directory":{{   
        "app": {{
            "directory":{{   
            "api": {{
                "directory":{{  
                "chat": {{
                    "directory":{{ 
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
    - strictly return only the JSON format
    
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
    
    async def generate_response(self, user_input: str, user_id: str):
        agent = self.get_or_create_agent(user_id)
        try:
            thread = await agent.run(user_input)
            return [msg for msg in thread if msg['role'] != 'system']
        except Exception as e:
            print(e)
            return [{"role": "assistant", "content": "Something went wrong, please try again later"}]
