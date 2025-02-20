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
def get_activities_by_activity_name(acitivity: str, location: str) -> List[str]:
        conn = psycopg2.connect(os.getenv("DATABASE_URL"))
        cursor = conn.cursor()
        cursor = conn.cursor()

        print("location", location)
        response = openai.embeddings.create(
            input=[f"{acitivity} in {location}"],
            model="text-embedding-ada-002"
         )

        query_embedding = response.data[0].embedding
        query_vector_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        # get location id
        cursor.execute(f"SELECT id FROM destination WHERE name ILIKE '{location}'")
        row = cursor.fetchone()
        location_id = row[0]

        print("location_id", location_id)

        threshold = 0.5  # Set your desired threshold
        sql = """
            SELECT 
                id, 
                name, 
                description,
                -(embedding <#> %s::vector) as similarity
            FROM must_travel_activity 
            WHERE 
                destination_id = %s 
                AND -(embedding <#> %s::vector) > 0.85  -- Cosine similarity threshold
            ORDER BY similarity DESC
            LIMIT 5;
        """

        cursor.execute(sql, (
            query_vector_str,
            location_id,
            query_vector_str
        ))

        rows = cursor.fetchall()
        activities = []

        for row in rows:
            print(row)
            activity_id = row[0]
            activity_name = row[1]
            activity_desc = row[2]
            distance = row[3]
            print(f"Activity: {activity_name}, Distance: {distance}")
            activities.append(activity_name)

        cursor.close()
        conn.close()
        return activities

@track
def get_activities_by_group_type(group_type: str, location: str) -> List[str]:
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()

    print("group_type", group_type)
    response = openai.embeddings.create(
        input=[group_type],
        model="text-embedding-ada-002"
    )

    query_embedding = response.data[0].embedding
    query_vector_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

    # get location id
    cursor.execute(f"SELECT id FROM destination WHERE name ILIKE '{location}'")
    row = cursor.fetchone()
    location_id = row[0]

    print("location_id", location_id)

    sql = """
        WITH matching_groups AS (
            SELECT 
                id,
                name,
                -(embedding <#> %s::vector) as similarity
            FROM travel_group
            WHERE -(embedding <#> %s::vector) > 0.85
            ORDER BY similarity DESC
            LIMIT 3
        )
        SELECT 
            mta.id,
            mta.name,
            mta.description,
            mtagt.rating,
            mg.name as group_name,
            mg.similarity as group_similarity
        FROM must_travel_activity mta
        JOIN must_activity_group_theme mtagt ON mta.id = mtagt.must_travel_activity_id
        JOIN matching_groups mg ON mtagt.travel_group_id = mg.id
        WHERE mta.destination_id = %s
        ORDER BY mg.similarity DESC, mtagt.rating DESC
        LIMIT 5;
    """

    cursor.execute(sql, (
        query_vector_str,
        query_vector_str,
        location_id
    ))
    rows = cursor.fetchall()
    activities = []

    for row in rows:
        id_ = row[0]
        activity_name = row[1]
        activity_desc = row[2]
        group_name = row[4]
        rating = row[3]
        print(f"Activity: {activity_name}, Rating: {rating} for group: {group_name}")
        activities.append(activity_name)

    cursor.close()
    conn.close()
    return activities
