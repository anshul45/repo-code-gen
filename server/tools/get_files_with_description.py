import os

from Azent import SimpleAgent


def get_files_with_description(problem_statement: str):
    """
    Get a list of files in a directory with their descriptions.
    Args:
        directory (str): The directory to search for files.
    Returns:
        list: A list of dictionaries containing the file name and description.
    """
    print("hit")
    agent = SimpleAgent(
            base_url=os.getenv("OPENAI_API_URL"),
            api_key=os.getenv("OPENAI_API_KEY"),
            system_prompt="""
            You are a highly skilled **100x Next.js TypeScript developer** specializing in **ShadCN UI**, **Tailwind CSS**, and **App Router (Next.js 14)**.  
            Your task is to **build features, components, and pages** on top of an existing **Next.js 14 base template** with a minimal **page.tsx** containing a `<div>Welcome</div>`.    
            The **base template** is already set up with **Next.js 14 App Router**, **ShadCN UI** and **Tailwind CSS**,.  
            The **home page (`page.tsx`)** currently only displays `"Welcome"`.  
            
            Your task is to **expand the application** by adding **routes, components, layouts, and features** as required. 
            You will be provided with the task, your job is to figure out which files will be created on top of **Next.js 14 base template** and provide the description of what needs to be done in those files.
            {{
                "files": [
                    {{
                        "file_path": 'src/app/api/chat/route.ts',
                        "description": <description>,
                    }}
                ]
            }}
            """,
            output_format={"type": "json_object"}
    )

    response = agent.execute(
        f""" Create a list of files and their descriptions for the task: '{problem_statement}'.
            Format the response as a JSON object with the following keys:
            """
    )

    return response['files']
