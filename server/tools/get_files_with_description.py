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
    agent = SimpleAgent(
            base_url=os.getenv("OPENAI_API_URL"),
            api_key=os.getenv("OPENAI_API_KEY"),
            system_prompt="""You are a highly skilled 100x technical lead and 100x developer which solves and build the task provided to you.
            You will be provided with base repo structure. The project is in NextJS 14, App Router, ShadCN UI, Prisma, and PostgreSQL and tailwind css.
            You will be provided with the task, your job is to figure out which files will be created or modified and provide the description of what needs to be done in those files.
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
