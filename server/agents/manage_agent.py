from pathlib import Path
from typing import Dict
from dotenv import load_dotenv
import json

from Azent.Azent import Agent
from cache.cache import RedisCache
from tools import get_files_with_description


class ManagerAgent:
    """Class to handle the conversation management using the custom Agent class"""

    def __init__(self):
        load_dotenv()
        self.active_sessions: Dict[str, Agent] = {}
        self.cache = RedisCache()

    def get_or_create_agent(self, user_id: str) -> Agent:
        """Get existing agent or create new one for the user"""
        if user_id not in self.active_sessions:
            self.project_details = self.cache.get_project_details(user_id)
            print("project details", self.project_details)
            print('parent dir', Path(__file__).resolve().parent.parent)

            self.active_sessions[user_id] = Agent(
                name='manager agent',
                model="gpt-4o",
                instructions=f'''
                You are a highly skilled 100x technical lead and 100x developer which solves and build the task provided to you.
                Your main task is to understand task, and based on that you should reply back and call specific tools if needed and ask questions if any.
                You should have more like a conversation kind of interaction with the user for example, you can mention a plan which you will use to build a feature or you can ask a clarification questions.
                You will be provided with tools which you can use to build the task.

                Available tools are:
                    - <get_files_with_description> : This tool will return the list of files which needs to be created or updated in the project.
                ''',
                session_id=user_id,
                tools=[
                    get_files_with_description
                ]
            )
        return self.active_sessions[user_id]

    def generate_files_one_by_one(self, user_input: str, user_id: str):
        """Generate and send files sequentially one by one"""
        agent = self.get_or_create_agent(user_id)

        try:
            thread = agent.run(user_input)
            return [msg for msg in thread if msg['role'] != 'system']


            # Step 2: Generate and send each file one by one
            # for file_info in file_list:
            #     file_name = file_info["file"]
            #     file_path = file_info["path"]
            #     file_desc = file_info["description"]

            #     # Generate file content
            #     generated_code = agent.run(f"Write the full code for {file_name}. Description: {file_desc}. \
            #         Ensure it is complete, formatted, and runnable.")

            #     # Step 3: Send JSON response for the file
            #     yield json.dumps({
            #         "file": file_name,
            #         "path": file_path,
            #         "content": generated_code
            #     }) + "\n"

        except Exception as e:
            print(f"Error generating files: {e}")

    async def generate_response_stream(self, user_input: str, user_id: str):
        """Generate streaming response using the manager agent"""
        agent = self.get_or_create_agent(user_id)
        print("agent", agent.name)
        try:
            response = agent.run(user_input, stream=True)
            for chunk in response:
                if hasattr(chunk.choices[0], 'delta'):
                    # Handle regular content
                    if chunk.choices[0].delta.content:
                        yield f"data: {chunk.choices[0].delta.content}\n\n"

                    # Handle tool calls
                    if chunk.choices[0].delta.tool_calls:
                        for tool_call in chunk.choices[0].delta.tool_calls:
                            try:
                                result = agent.execute_tool_call(tool_call, agent.tools_map)
                                yield f"data: \nTool Result: {json.dumps(result)}\n\n"
                            except Exception as tool_error:
                                print(f"Tool execution error: {tool_error}")
                                yield f"data: \nError executing tool: {str(tool_error)}\n\n"

                elif hasattr(chunk.choices[0], 'message'):
                    # Handle non-streaming responses (like tool results)
                    if chunk.choices[0].message.content:
                        yield f"data: {chunk.choices[0].message.content}\n\n"

            # Send a final newline to ensure the last message is flushed
            yield "data: \n\n"

        except Exception as e:
            print(f"Error generating response: {e}")
            yield f"data: Error: {str(e)}\n\n"

    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]
