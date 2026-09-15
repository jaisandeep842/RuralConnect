import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("ruralconnect.database")

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_instance.db = db_instance.client[settings.MONGO_DB_NAME]
    
    # Create essential indexes
    try:
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.users.create_index("phone")
        await db_instance.db.lessons.create_index([("course_id", 1), ("lesson_number", 1)])
        await db_instance.db.learning_progress.create_index([("user_id", 1), ("course_id", 1), ("lesson_id", 1)], unique=True)
        await db_instance.db.training_registrations.create_index([("user_id", 1), ("training_id", 1)], unique=True)
        await db_instance.db.mentor_appointments.create_index([("user_id", 1), ("mentor_id", 1)])
        logger.info("Successfully connected to MongoDB and verified indexes.")
    except Exception as e:
        logger.warning(f"Connected to MongoDB, but index creation deferred or already exists: {e}")

async def close_mongo_connection():
    if db_instance.client:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database() -> AsyncIOMotorDatabase:
    return db_instance.db
