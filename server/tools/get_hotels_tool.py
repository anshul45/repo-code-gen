from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import gradio as gr
from typing import Any, List, Tuple, Dict
from dotenv import load_dotenv
import psycopg2
from Azent.Azent import Agent
import openai
import os
from opik.integrations.openai import track_openai
from opik import track

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

@track
def get_hotels_by_location(place: str, hotel_description: str = None) -> List[str]:
    """
    Get hotels by either location or destination name, with optional hotel description for semantic search.
    
    Args:
        place: Location or destination name
        hotel_description: Optional description to find semantically similar hotels
    """
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()

    print("Searching hotels for:", place)

    if hotel_description:
        # Create embedding for hotel description
        response = openai.embeddings.create(
            input=[hotel_description],
            model="text-embedding-ada-002"
        )
        query_embedding = response.data[0].embedding
        query_vector_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        sql = """
            SELECT 
                h.id,
                h.name,
                l.name as location_name,
                d.name as destination_name,
                -(h.embedding <#> %s::vector) as similarity
            FROM hotel h
            JOIN location l ON h.location_id = l.id
            JOIN destination d ON l.destination_id = d.id
            WHERE 
                (l.name ILIKE %s OR d.name ILIKE %s)
                AND -(h.embedding <#> %s::vector) > 0.85
            ORDER BY similarity DESC
            LIMIT 5;
        """
        cursor.execute(sql, (
            query_vector_str,
            f"%{place}%",
            f"%{place}%",
            query_vector_str
        ))
    else:
        # Simple location/destination based search
        sql = """
            SELECT 
                h.id,
                h.name,
                h.description,
                l.name as location_name,
                d.name as destination_name
            FROM hotel h
            JOIN location l ON h.location_id = l.id
            JOIN destination d ON l.destination_id = d.id
            WHERE l.name ILIKE %s OR d.name ILIKE %s
            LIMIT 5;
        """
        cursor.execute(sql, (f"%{place}%", f"%{place}%"))

    rows = cursor.fetchall()
    hotels = []

    for row in rows:
        hotel_name = row[1]
        description = row[2]
        location_name = row[3]
        destination_name = row[4]
        similarity = row[5] if hotel_description else None
        
        print(f"Hotel: {hotel_name}, Location: {location_name}, Destination: {destination_name}" + 
              (f", Similarity: {similarity}" if similarity else ""))
        hotels.append(f"{hotel_name}, {description} in {location_name}, {destination_name}")

    cursor.close()
    conn.close()
    return hotels
