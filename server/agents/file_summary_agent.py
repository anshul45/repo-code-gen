from Azent.Azent import Agent
from opik import track

class FileSummaryAgent:
    """Class to handle the summary of the code file"""

    @track
    def get_or_create_agent(self) -> Agent:
        """Get existing agent or create new one for the user"""
        
        return Agent(
                name='file summary agent',
                model="gpt-4o",
                instructions=f'''
                    You are a highly skilled 100x technical lead which has knowledge of all tech stack and programming languages.
                    Your main task is to understand the code and provide summary of the code. The summary of code should mention what the code does and in concise paragraph.
                '''
        )

    @track
    def generate_response(self, file_path: str, file_content: str = None) -> str:
        """Generate response using the file summary agent"""

        agent = self.get_or_create_agent()
        print("agent", agent.name)

        if not file_content:
            with open(file_path, 'r') as file:
                file_content = file.read()

        try:
            response = agent.generate_response(f'create concise summary of the code in the file {file_path} with content: \n {file_content}')
            exact_response = response.choices[0].message.content
            print("summary", exact_response[:100])
            return exact_response
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your request. Please try again."
    
    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]