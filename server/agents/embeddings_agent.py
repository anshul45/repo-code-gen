from Azent.Azent import Agent
from opik import track
import os
from openai import OpenAI

class EmbeddingsAgent:
    """Class to handle the summary of the code file"""

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    @track
    def generate_response(self, file_path: str, summary: str) -> str:
        """Generate response using the file summary agent"""

        print(f"creating embeddings for file {file_path}")
        try:
            response =  self.client.embeddings.create(
                input=[summary],
                model="text-embedding-3-small"
            )

            embedding_vector = response.data[0].embedding
            return embedding_vector
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "I apologize, but I encountered an error processing your request. Please try again."
    
    def clear_conversation(self, user_id: str) -> None:
        """Clear user's conversation by removing their agent"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]