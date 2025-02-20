from opik.integrations.openai import track_openai
from opik import track
import os
from agents.embeddings_agent import EmbeddingsAgent
from agents.file_summary_agent import FileSummaryAgent
from cache.cache import RedisCache
from clients.pinecone_client import PineconeClient

class FileTool:
    def __init__(self):
        self.pinecone_client = PineconeClient()
        self.file_summary_agent = FileSummaryAgent()
        self.embedding_agent = EmbeddingsAgent()
        self.cache = RedisCache()

    @track
    def get_relevant_files_for_feature(self, feature_description: str):
        """
        get relevant files for a feature description
        """
        try:
            # convert feature description to vector
            feature_vector = self.embedding_agent.generate_response('filepath_none', feature_description)
            results = self.pinecone_client.query_vectors([feature_vector], top_k=5)
            print("results", results)
            return 'relevant files: ' + ', '.join([result['metadata']['file'] for result in results['matches']])
        except Exception as e:
            print(f"Error fetching files: {str(e)}")
            return False

    @track
    def read_file_content(self, file_path: str) -> list:
        """
        Read content of the file
        Args:
            file_path: Path of the file to read
        Returns:
            list: string lines of the file
        """
        try:
            with open(file_path, 'r') as file:
                code = file.read()
                print("reading code file", code[: 10])
                return f'{file_path} content: \n {code}'
        except Exception as e:
            print(f"Error reading file content: {str(e)}")
            return ''
    
    # get file summary
    @track
    def get_file_summary(self, file_path: str) -> str:
        """
        Get summary of the file
        Args:
            file_path: Path of the file to summarize
        Returns:
            str: Summary of the file
        """
        try:
           if self.cache.get(file_path + '_summary'):
               return self.cache.get(file_path)
           
           summary = self.file_summary_agent.generate_response(file_path)
           self.cache.set(file_path + '_summary', summary)
           return summary

        except Exception as e:
            print(f"Error getting file summary: {str(e)}")
            return ''
