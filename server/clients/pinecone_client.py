from pinecone import Pinecone
import numpy as np
from typing import List, Dict, Any
import os
from datetime import datetime

class PineconeClient:
    def __init__(self):
    # def __init__(self, api_key: str, environment: str, index_name: str, dimension: int = 1536):

        """
        Initialize Pinecone client with configuration.
        
        Args:
            api_key: Your Pinecone API key
            environment: Pinecone environment (e.g., "us-west1-gcp")
            index_name: Name of the Pinecone index
            dimension: Dimension of vectors to be stored (default 1536 for OpenAI embeddings)
        """
        self.api_key = 'pcsk_62x58K_P6hnnnuAVURoDRs7BubqGpPpbmRPTfeoAm4g6gjxAjnrPZRFHUovnakReTQZSsh'
        self.environment =  'dev'
        self.index_name = 'code-files'
        self.dimension = 1536
        
        pc = Pinecone(api_key=self.api_key, environment=self.environment)
        self.index = pc.Index(self.index_name)
    
    def upsert_vectors(self, vectors: List[List[float]], metadata: List[Dict[str, Any]], ids: List[str] = None) -> bool:
        """
        Upsert vectors to Pinecone index.
        
        Args:
            vectors: List of vectors to insert
            metadata: List of metadata dictionaries for each vector
            ids: Optional list of IDs for the vectors. If not provided, timestamps will be used.
        
        Returns:
            bool: True if upsert was successful
        """
        if ids is None:
            ids = [str(datetime.now().timestamp()) + f"_{i}" for i in range(len(vectors))]
        
        # Prepare vectors in Pinecone format
        vector_data = list(zip(ids, vectors, metadata))
        
        try:
            # Upsert in batches of 100 (Pinecone's recommended batch size)
            batch_size = 100
            for i in range(0, len(vector_data), batch_size):
                batch = vector_data[i:i + batch_size]
                self.index.upsert(vectors=batch)
            return True
        except Exception as e:
            print(f"Error upserting vectors: {str(e)}")
            return False
    
    def query_vectors(self, query_vector: List[float], top_k: int = 5, filter: Dict = None) -> Dict:
        """
        Query nearest neighbors from Pinecone index.
        
        Args:
            query_vector: Vector to query against
            top_k: Number of nearest neighbors to return
            filter: Optional metadata filters
        
        Returns:
            Dict: Query results containing matches
        """
        try:
            results = self.index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter
            )
            return results
        except Exception as e:
            print(f"Error querying vectors: {str(e)}")
            return None
    
    def delete_vectors(self, ids: List[str]) -> bool:
        """
        Delete vectors from Pinecone index.
        
        Args:
            ids: List of vector IDs to delete
        
        Returns:
            bool: True if deletion was successful
        """
        try:
            self.index.delete(ids=ids)
            return True
        except Exception as e:
            print(f"Error deleting vectors: {str(e)}")
            return False
    
    def get_index_stats(self) -> Dict:
        """
        Get statistics about the Pinecone index.
        
        Returns:
            Dict: Index statistics
        """
        try:
            return self.index.describe_index_stats()
        except Exception as e:
            print(f"Error getting index stats: {str(e)}")
            return None
