import json
import os

from curie_agent.SimpleAgent import SimpleAgent

def get_files_with_description(problem_statement: str):
    """
    Get a list of files in a directory with their descriptions.
    Args:
        directory (str): The directory to search for files.
    Returns:
        list: A list of dictionaries containing the file name and description.
    """

    # read the base_template json file
    with open('/Users/abhilasha/Documents/chatbots/code-gen-bot/server/tools/base_template.json') as f:
        base_template = json.load(f)

    agent = SimpleAgent(
            base_url=os.getenv("LLM_BASE_URL"),
            api_key=os.getenv("LLM_API_KEY"),
            model='gemini-2.0-flash',
            system_prompt="""
            You are a highly skilled **100x Next.js TypeScript developer** specializing in **Radix UI**, **Tailwind CSS**, and **App Router (Next.js 14)**.  
            Your task is to plan which files need to be created for the project and provide the description of what needs to be done in those files like a best MVP product.
            These files are connected to each other, meaning this is functional connected application, where user can navigate between pages and components.
            You need to mention the files transition in the descriptcion of the file that is interacting with other files.
            The **base_template** is already set up with **Next.js 14 App Router**, **Radix UI** and **Tailwind CSS** and it is provided to you as a context in json format.
            
            Your task is to **expand the application** by adding **routes, components, layouts, styling and features** as required. 
            You will be provided with the plan for a micro application which needs to implemented, understand it and create which files need to be created and provide the description of what needs to be done in those files for implementation purposes.
            
            **IMPORTANT POINTS:**
                - the code should use src/app/page.tsx as the main page or any app should start from this page. for example, if you are cereating a todo app, then the code should start from src/app/page.tsx where the todo app should start.
                - The UI page .tsx file should be inside folder in the app directory.
                - the api file is .route.ts file and should be inside folder in the api directory.
                
            OUTPUT JSON FORMAT:
                {{
                    "files": [
                        {{
                            "file_path": 'src/app/api/chat/route.ts',
                            "description": <description>,
                        }}
                    ]
                }}
            
            [base_template]
            {base_template}
            """.replace('{base_template}', json.dumps(base_template)),
            output_format={"type": "json_object"}
    )

    response = agent.execute(
        f""" Create a list of files and their descriptions for micro application building plan: '{problem_statement}'.
            Format the response as a JSON object with the following keys:
            """
    )

    return response['files']
