import json
from functools import wraps
from typing import Optional

from redis import Redis

class RedisCache:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'client'):
            self.client = Redis(
                host='localhost',
                port=6379,
                db=0,
                decode_responses=True
            )

    def set_project_details(self, project_id: str, data: dict, expire_time: int = 3600) -> None:
        """set project details"""
        self.client.setex(
            project_id,
            expire_time,
            json.dumps(data)
        )

    def get_project_details(self, project_id: str) -> Optional[dict]:
        """get project details"""
        data = self.client.get(project_id)
        return json.loads(data) if data else None

    def delete_project_details(self, project_id: str) -> None:
        """Delete itinerary data"""
        self.client.delete(project_id)
    
    def get_ttl(self, project_id: str) -> int:
        """Get remaining time to live for an itinerary in seconds"""
        return self.client.ttl(project_id)

    def debug_info(self, itinerary_key: str = None) -> dict:
        """Get debug information about cache"""
        if itinerary_key:
            key = f"itinerary:{itinerary_key}"
            return {
                'key': key,
                'exists': self.client.exists(key),
                'ttl': self.client.ttl(key),
                'type': self.client.type(key),
                'value': self.get_itinerary(itinerary_key)
            }
        else:
            return {
                'total_keys': len(self.client.keys("itinerary:*")),
                'all_itineraries': self.list_all_itineraries()
            }