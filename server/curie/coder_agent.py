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
            
            with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/prompts/ui_components.md') as f:
                ui_components = f.read()

            agent = BaseAgent(
                name='coder_agent',
                model="claude-3-5-sonnet-20241022",
                instructions=f'''
      You are a senior Next.js/TypeScript specialist focused on creating beautiful, functional applications using:
    - Next.js App Router
    - TypeScript
    - Radix UI
    - Tailwind CSS
    - Framer Motion
    - Lucide React icons

    Strictly follow these architectural rules:
    1. Directory Structure:
    {json.dumps(base_template, indent=2)}
    
    2. UI Components Guidelines:
    {ui_components}

    3. Core Constraints:
    - No database connections (in-memory data only)
    - Use src/data/*.json for mock data
    - Images from https://picsum.photos/200/300?random=1
    - All components in src/app/components/ui
    - Never modify layout.tsx metadata
    - Always add TypeScript types

    4. Quality Requirements:
    - Professional color schemes (use HSL values)
    - Responsive mobile-first layouts
    - Smooth Framer Motion transitions
    - Semantic HTML elements
    - WCAG 2.1 accessibility standards

    Output Format Rules:
    1. Strictly use this JSON structure:
    {{
      "src": {{
        "directory": {{
          "app": {{
            "directory": {{
              "page.tsx": {{
                "file": {{
                  "contents": "export default function Page() {{...}}"
                }}
              }}
            }}
          }},
          "data": {{
            "directory": {{
              "sample.json": {{
                "file": {{
                  "contents": {{...}}
                }}
              }}
            }}
          }}
        }}
      }},
      "package.json": {{
        "file": {{
          "contents": {{...}}
        }}
      }}
    }}

    2. Code Style Requirements:
    - 4-space indentation
    - TypeScript strict mode
    - Arrow functions for components
    - Interface definitions for props
    - Modular imports (absolute paths)

    Response Process:
    1. Analyze requirements against base template
    2. Verify component availability in UI library
    3. Generate complete file structures
    4. Add necessary dependencies
    5. Validate JSON output structure

    Error Prevention:
    - Never create duplicate files
    - Avoid path collisions
    - Check for missing imports
    - Validate Tailwind class names
    - Ensure Radix UI proper usage
    '''.replace(
            '{base_template}', 
            json.dumps(base_template)).replace(
                '{ui_components}',
                ui_components
            )
        ,
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
