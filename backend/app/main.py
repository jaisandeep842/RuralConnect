import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.seed_data import seed_database
from app.routers import (
    auth, users, courses, mentors, training,
    schemes, community, certificates, notifications,
    assistant, recommendations, admin
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ruralconnect.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing RuralConnect Backend Services...")
    await connect_to_mongo()
    try:
        await seed_database()
    except Exception as e:
        logger.warning(f"Database seed skipped or error: {e}")
    yield
    logger.info("Shutting down RuralConnect Backend Services...")
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For flexible local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(mentors.router)
app.include_router(training.router)
app.include_router(schemes.router)
app.include_router(community.router)
app.include_router(certificates.router)
app.include_router(notifications.router)
app.include_router(assistant.router)
app.include_router(recommendations.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "platform": "RuralConnect",
        "tagline": "Learn. Connect. Grow.",
        "status": "online",
        "version": settings.PROJECT_VERSION,
        "swagger_docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2026-03-01T12:00:00Z"
    }
