import asyncio
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)

from app.database import connect_to_mongo, get_database, close_mongo_connection

async def update_lessons():
    await connect_to_mongo()
    db = get_database()
    lessons = await db.lessons.find({}).to_list(100)
    for l in lessons:
        url = l.get("embed_url", "")
        if "youtube.com" in url and "youtube-nocookie.com" not in url:
            new_url = url.replace("www.youtube.com", "www.youtube-nocookie.com")
            await db.lessons.update_one({"_id": l["_id"]}, {"$set": {"embed_url": new_url}})
            print(f"Updated {l['_id']} -> {new_url}")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(update_lessons())
