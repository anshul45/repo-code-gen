from pathlib import Path
from typing import Dict
from dotenv import load_dotenv
from Azent.Azent import Agent
import os
from cache.cache import RedisCache
from tools import get_file_tool
from opik import track

class ManagerAgent:
    """Class to handle the conversation management using the custom Agent class"""
    
    def __init__(self):
        load_dotenv()
        self.active_sessions: Dict[str, Agent] = {}
        self.cache = RedisCache()

    
    @track
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
                Your main task is to understand task, code it and based on that you should reply back and call specific tools if needed and ask questions if any.
                The code should be complete with no placeholders, clean, well documented and should be able to run without any errors.
                The code would be generated for an existing project.
                You should have more like a conversation kind of interaction with the user for example, you can mention a plan which you will use to build a feature or you can ask a clarification questions.
                In the feature development, you may need to create new file, so mention filename/filepath as well.

                Available Tools:
                 - <get_relevant_files> - To get relevant files from the project
                 - <get_file_summary> - To get summary of the file
                 - <read_file_content> - To read content of the file
        
                The project details are:
                # Project Configuration

                    ## Story Selection
                    - When fetching user stories:
                    - Present stories for user selection
                    - Allow user to select target stories for implementation by story title
                    - Remember User selection and user story through out the chat
                    - Keep repeating unfinished task in output so that it don't get lost.

                    ## Technology Stack
                    - Next.js with TypeScript
                    - Prisma ORM
                    - NextAuth.js
                    - ShadCN UI
                    - Tailwind CSS
                    - Zustand State Management
                    - Jest Testing
                    - PNPM Package Manager

                    # Development Guidelines

                    ## Package Management
                    - Use PNPM for all package installations and management
                    - Verify package.json for dependencies before adding new ones
                    - Maintain lock file integrity

                    ## Code Architecture
                    - Follow Next.js 14+ App Router structure
                    - Maintain separation of concerns:
                    - Components in /components
                    - API routes in /app/api
                    - Utilities in /utils
                    - Types in /types
                    - Constants in /constants
                    - Hooks in /hooks
                    - Store management in /store
                    - Validations in /validations

                    ## Component Guidelines
                    - Use ShadCN UI components from /components/ui/*
                    - Follow atomic design principles
                    - Maintain consistent component structure:
                    - Props interface at top
                    - Component logic
                    - JSX return
                    - Use custom hooks for reusable logic

                    ## Database & API
                    - Use Prisma for all database operations
                    - Follow REST API patterns in /app/api routes
                    - Implement proper error handling and validation
                    - Use zod schemas from /validations for data validation

                    ## Authentication
                    - Use NextAuth.js for authentication
                    - Follow existing auth patterns in /app/(auth)

                    ## State Management
                    - Use Zustand for global state management
                    - Follow store patterns in /store directory
                    - Keep stores atomic and focused

                    ## Styling
                    - Use Tailwind CSS for styling
                    - Follow existing color scheme and design system
                    - Maintain responsive design patterns

                    ## Testing
                    - Write Jest tests for new components
                    - Follow existing test patterns in __tests__
                    - Include unit tests for utilities and hooks
                    - Test API routes for proper error handling

                    ## Error Handling
                    - Use custom error boundaries
                    - Implement proper API error responses
                    - Follow error handling patterns in /app/error.tsx

                    ## Path Aliases
                    - Use @/ prefix for imports (configured in tsconfig.json)
                    - Maintain consistent import structure
                    - Follow existing import patterns

                    ## Code Style
                    - Follow existing TypeScript patterns
                    - Use proper type definitions
                    - Ignore formatting-related linting:
                    - Quote style (single/double)
                    - Whitespace
                    - Indentation

                    ## Implementation Flow
                    1. Database Schema (if needed)
                    2. API Routes
                    3. Types/Interfaces
                    4. Store/Hooks
                    5. Components
                    6. Tests

                    ## Response Generation Rules
                    - Analyze existing implementations before adding new code
                    - Follow established patterns in similar files
                    - Use existing utility functions from /utils
                    - Implement proper error handling at all levels
                    - Include necessary type definitions
                    - Add appropriate tests
                    - Follow the project's component hierarchy
                    - Use existing validation schemas or create new ones following patterns
                    - Implement proper loading and error states
                    - Follow existing authentication patterns
                    - Use appropriate ShadCN UI components
                    - Follow existing store patterns for state management

                    ## Code Modification Rules
                    - Only modify files related to current task
                    - Preserve existing patterns and conventions
                    - Maintain type safety
                    - Keep changes focused and minimal
                    - Follow existing error handling patterns
                    - Preserve existing test coverage

                    ## Quality Checks
                    - Verify TypeScript types
                    - Ensure Prisma schema integrity
                    - Check component composition
                    - Verify API route implementation
                    - Validate auth integration
                    - Test store implementation
                    - Verify responsive design
                    - Check accessibility
                    - Validate error handling

                    ## Images Access
                    - for some code generation, the images are required to display on UI, use random images using picsum, for example: https://picsum.photos/200/300

                project directory structure:
                {self.project_details}

                current working directory: 
                {Path(__file__).resolve().parent.parent}/cloned_repos/{user_id}/virtual-stagging
                ''',
                tools=[
                    get_file_tool.FileTool().get_relevant_files_for_feature,
                    get_file_tool.FileTool().read_file_content
                ]
            )
        return self.active_sessions[user_id]

    @track
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
                        yield chunk.choices[0].delta.content
                    
                    # Handle tool calls
                    if chunk.choices[0].delta.tool_calls:
                        for tool_call in chunk.choices[0].delta.tool_calls:
                            try:
                                result = agent.execute_tool_call(tool_call, agent.tools_map)
                                yield f"\nTool Result: {json.dumps(result)}\n"
                            except Exception as tool_error:
                                print(f"Tool execution error: {tool_error}")
                                yield f"\nError executing tool: {str(tool_error)}\n"
                
                elif hasattr(chunk.choices[0], 'message'):
                    # Handle non-streaming responses (like tool results)
                    if chunk.choices[0].message.content:
                        yield chunk.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {e}")
            yield f"Error: {str(e)}"
    
    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]
