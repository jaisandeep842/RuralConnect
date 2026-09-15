import pytest
import httpx

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_health():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/")
        assert res.status_code == 200
        data = res.json()
        assert data["platform"] == "RuralConnect"

@pytest.mark.asyncio
async def test_login_demo_user():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.post("/api/auth/login", json={
            "email_or_phone": "sunita@ruralconnect.in",
            "password": "Rural@12345"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["full_name"] == "Sunita Kamble"
        assert data["user"]["role"] == "entrepreneur"

@pytest.mark.asyncio
async def test_login_admin():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.post("/api/auth/login", json={
            "email_or_phone": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["user"]["role"] == "admin"

@pytest.mark.asyncio
async def test_courses_and_required_youtube_lectures():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/courses")
        assert res.status_code == 200
        courses = res.json()
        assert len(courses) >= 3

        # 1. Entrepreneurship Course
        ent_course = next((c for c in courses if c["id"] == "course-entrepreneurship"), None)
        assert ent_course is not None

        res_lessons = await client.get(f"/api/courses/{ent_course['id']}/lessons")
        assert res_lessons.status_code == 200
        lessons = res_lessons.json()
        assert len(lessons) == 3

        # Exactly 3 required YouTube lectures
        expected_ent_embeds = [
            "https://www.youtube-nocookie.com/embed/kAAO-qO2kFg",
            "https://www.youtube-nocookie.com/embed/pC5l5j2u9SQ",
            "https://www.youtube-nocookie.com/embed/1Tf9NHbRPYM"
        ]
        for idx, l in enumerate(lessons):
            assert l["embed_url"] == expected_ent_embeds[idx]
            assert l["is_embeddable"] is True

        # 2. Digital Marketing Course
        dm_course = next((c for c in courses if c["id"] == "course-digital-marketing"), None)
        assert dm_course is not None

        res_dm_lessons = await client.get(f"/api/courses/{dm_course['id']}/lessons")
        assert res_dm_lessons.status_code == 200
        dm_lessons = res_dm_lessons.json()
        assert len(dm_lessons) == 2

        # Exactly 2 required YouTube lectures
        expected_dm_embeds = [
            "https://www.youtube-nocookie.com/embed/ZucOiqzRznA",
            "https://www.youtube-nocookie.com/embed/OC8s2_VSQFA"
        ]
        for idx, l in enumerate(dm_lessons):
            assert l["embed_url"] == expected_dm_embeds[idx]
            assert l["is_embeddable"] is True

@pytest.mark.asyncio
async def test_indian_mentors():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/mentors")
        assert res.status_code == 200
        mentors = res.json()
        assert len(mentors) >= 5
        for m in mentors:
            assert m["is_verified"] is True
            assert any(loc in m["location"] for loc in ["Pune", "Kolhapur", "Nashik", "Aurangabad", "Satara", "Maharashtra"])

@pytest.mark.asyncio
async def test_verified_schemes():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/schemes?verified_only=true")
        assert res.status_code == 200
        schemes = res.json()
        assert len(schemes) >= 5
        scheme_names = [s["scheme_name"] for s in schemes]
        assert any("PMEGP" in name for name in scheme_names)
        assert any("Mudra" in name for name in scheme_names)

@pytest.mark.asyncio
async def test_training_workshops():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        res = await client.get("/api/training")
        assert res.status_code == 200
        trainings = res.json()
        assert len(trainings) >= 5

@pytest.mark.asyncio
async def test_ai_assistant_rag():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Test in English
        res_en = await client.post("/api/assistant/chat", json={
            "message": "What subsidy does PMEGP give to rural women?",
            "language": "en"
        })
        assert res_en.status_code == 200
        data_en = res_en.json()
        assert "reply" in data_en
        assert len(data_en["sources"]) > 0

        # Test in Marathi
        res_mr = await client.post("/api/assistant/chat", json={
            "message": "घरून खाद्यपदार्थ किंवा लोणचे व्यवसाय कसा सुरू करावा?",
            "language": "mr"
        })
        assert res_mr.status_code == 200
        data_mr = res_mr.json()
        assert "reply" in data_mr
