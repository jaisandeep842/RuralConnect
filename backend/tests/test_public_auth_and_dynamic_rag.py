import pytest
import uuid
import httpx
from datetime import datetime
from app.main import app
from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.seed_data import seed_database
from app.services.rag_service import (
    retrieve_best_knowledge, generate_rag_answer, load_knowledge_pool_from_db,
    _ACTIVE_KNOWLEDGE_POOL, CORE_72_KNOWLEDGE_BASE
)
from app.services.notification_service import DEV_OTP_REGISTRY

async def ensure_db():
    await connect_to_mongo()
    await seed_database()

@pytest.mark.asyncio
async def test_all_72_core_knowledge_items_preserved():
    """Verify that all 72 verified entrepreneurship Q&A items exist and are published."""
    await ensure_db()
    assert len(CORE_72_KNOWLEDGE_BASE) == 72
    db = get_database()
    if db is not None:
        count = await db.knowledge_base.count_documents({"status": "published", "is_verified": True})
        assert count >= 72

@pytest.mark.asyncio
async def test_public_user_registration_and_login():
    """Test public registration with full entrepreneur profile and ensure role is entrepreneur."""
    await ensure_db()
    unique_num = str(uuid.uuid4().int)[:8]
    test_email = f"farmer_{unique_num}@ruralconnect.in"
    test_phone = f"98{unique_num}"

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register new entrepreneur
        reg_payload = {
            "full_name": "Ramesh Pawar",
            "email": test_email,
            "phone": test_phone,
            "password": "FarmerPassword@123",
            "preferred_language": "mr",
            "village": "Baramati",
            "district": "Pune",
            "state": "Maharashtra",
            "business_type": "Agriculture",
            "business_description": "Sugarcane and drip-irrigated pomegranate farming.",
            "interests": ["Organic Farming", "Government Subsidies"]
        }
        res = await client.post("/api/auth/register", json=reg_payload)
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == test_email.lower()
        assert data["user"]["role"] == "entrepreneur"

        # 2. Duplicate registration must fail
        dup_res = await client.post("/api/auth/register", json=reg_payload)
        assert dup_res.status_code == 400

        # 3. Login with email
        login_email = await client.post("/api/auth/login", json={
            "email_or_phone": test_email,
            "password": "FarmerPassword@123"
        })
        assert login_email.status_code == 200
        assert login_email.json()["user"]["full_name"] == "Ramesh Pawar"

        # 4. Login with phone
        login_phone = await client.post("/api/auth/login", json={
            "email_or_phone": test_phone,
            "password": "FarmerPassword@123"
        })
        assert login_phone.status_code == 200
        assert login_phone.json()["user"]["phone"] == test_phone

@pytest.mark.asyncio
async def test_phone_otp_request_and_login():
    """Test OTP request and phone OTP login flow."""
    await ensure_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Request OTP for registered demo user Sunita (phone: 9822334455)
        otp_req = await client.post("/api/auth/otp/request", json={
            "target": "9822334455",
            "type": "phone",
            "purpose": "login"
        })
        assert otp_req.status_code == 200
        req_data = otp_req.json()
        assert req_data["success"] is True

        otp_code = DEV_OTP_REGISTRY.get("9822334455") or req_data.get("dev_otp")
        assert otp_code is not None

        # Verify OTP and login
        verify_res = await client.post("/api/auth/otp/verify", json={
            "target": "9822334455",
            "otp": otp_code,
            "purpose": "login"
        })
        assert verify_res.status_code == 200
        data = verify_res.json()
        assert "access_token" in data
        assert data["user"]["full_name"] == "Sunita Kamble"

@pytest.mark.asyncio
async def test_forgot_password_flow():
    """Test forgot password OTP request, verification token, and password reset."""
    await ensure_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Request reset OTP
        req_res = await client.post("/api/auth/otp/request", json={
            "target": "sunita@ruralconnect.in",
            "type": "email",
            "purpose": "reset_password"
        })
        assert req_res.status_code == 200
        otp = DEV_OTP_REGISTRY.get("sunita@ruralconnect.in") or req_res.json().get("dev_otp")
        assert otp is not None

        # 2. Verify OTP to get signed verification token
        verify_res = await client.post("/api/auth/otp/verify", json={
            "target": "sunita@ruralconnect.in",
            "otp": otp,
            "purpose": "reset_password"
        })
        assert verify_res.status_code == 200
        v_token = verify_res.json()["verification_token"]
        assert v_token is not None

        # 3. Reset password
        new_pass = "Rural@NewPass2026"
        reset_res = await client.post("/api/auth/reset-password", json={
            "target": "sunita@ruralconnect.in",
            "verification_token": v_token,
            "new_password": new_pass
        })
        assert reset_res.status_code == 200

        # 4. Verify login with new password
        login_res = await client.post("/api/auth/login", json={
            "email_or_phone": "sunita@ruralconnect.in",
            "password": new_pass
        })
        assert login_res.status_code == 200

        # Reset back for other tests
        await client.post("/api/users/change-password", headers={
            "Authorization": f"Bearer {login_res.json()['access_token']}"
        }, json={"old_password": new_pass, "new_password": "Rural@12345"})

@pytest.mark.asyncio
async def test_admin_bootstrap_and_authorization():
    """Verify administrator bootstrap and strict role-based access control."""
    await ensure_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid bootstrap key is rejected
        bad_boot = await client.post("/api/auth/admin/bootstrap", json={
            "bootstrap_key": "wrong_key",
            "email": "hacker@test.com",
            "password": "pass"
        })
        assert bad_boot.status_code == 403

        # Valid bootstrap configures admin
        from app.config import settings
        good_boot = await client.post("/api/auth/admin/bootstrap", json={
            "bootstrap_key": settings.ADMIN_BOOTSTRAP_KEY,
            "email": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        assert good_boot.status_code == 200

        # Normal user cannot access admin API
        user_login = await client.post("/api/auth/login", json={
            "email_or_phone": "sunita@ruralconnect.in",
            "password": "Rural@12345"
        })
        user_token = user_login.json()["access_token"]
        user_admin_check = await client.get("/api/admin/stats", headers={
            "Authorization": f"Bearer {user_token}"
        })
        assert user_admin_check.status_code == 403

        # Admin user CAN access admin API
        admin_login = await client.post("/api/auth/login", json={
            "email_or_phone": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        admin_token = admin_login.json()["access_token"]
        admin_check = await client.get("/api/admin/stats", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        assert admin_check.status_code == 200

@pytest.mark.asyncio
async def test_dynamic_rag_lifecycle_add_edit_unpublish_delete():
    """
    CRITICAL TEST: Verifies that adding a question in Admin Dashboard immediately updates the live AI chatbot
    without code changes, editing updates it, and unpublishing removes it from retrieval!
    """
    await ensure_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Get admin token
        admin_login = await client.post("/api/auth/login", json={
            "email_or_phone": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        admin_token = admin_login.json()["access_token"]
        headers = {"Authorization": f"Bearer {admin_token}"}

        test_question = "What is the Kisan Drone Subsidy scheme in Maharashtra?"
        draft_answer = "DRAFT ONLY: Farmers get financial help for agricultural drones."
        published_answer = "Under the Sub-Mission on Agricultural Mechanization (SMAM), individual rural entrepreneurs get 40% subsidy up to Rs 4 lakh, while FPOs receive up to 75% financial grant for agricultural drones."
        updated_answer = "UPDATED 2026: The subsidy ceiling has been raised to Rs 5 lakh with free DGCA remote pilot drone training provided by Krishi Vigyan Kendra."

        # 1. Create as DRAFT
        create_draft_res = await client.post("/api/admin/knowledge-base", headers=headers, json={
            "title": "Kisan Drone Subsidy Scheme",
            "category": "Agriculture & Farming",
            "question": test_question,
            "answer": draft_answer,
            "source": "Maharashtra Department of Agriculture Notification",
            "tags": ["kisan drone", "drone subsidy", "agriculture mechanization"],
            "status": "draft",
            "is_verified": False
        })
        assert create_draft_res.status_code == 200
        item_id = create_draft_res.json()["id"]

        # 2. Check public AI Assistant query - DRAFT must NOT be retrieved!
        ans, lang, retrieved, sources, _ = await generate_rag_answer(test_question)
        # Should either be not retrieved or retrieved another item, but NOT the draft answer!
        assert draft_answer not in ans

        # 3. Publish the entry
        pub_res = await client.post(f"/api/admin/knowledge-base/{item_id}/publish", headers=headers)
        assert pub_res.status_code == 200
        assert pub_res.json()["status"] == "published"
        assert pub_res.json()["embedding_status"] == "indexed"

        # 4. Check public AI Assistant query - PUBLISHED must be RETRIEVED!
        ans_pub, lang_pub, ret_pub, sources_pub, _ = await generate_rag_answer(test_question)
        assert ret_pub is True
        assert len(sources_pub) > 0
        assert any("Kisan Drone" in s["title"] for s in sources_pub)

        # 5. Edit the answer
        edit_res = await client.put(f"/api/admin/knowledge-base/{item_id}", headers=headers, json={
            "answer": updated_answer,
            "answer_en": updated_answer
        })
        assert edit_res.status_code == 200

        # 6. Check public AI Assistant query - UPDATED answer must be retrieved!
        ans_edit, lang_edit, ret_edit, sources_edit, _ = await generate_rag_answer(test_question)
        assert ret_edit is True
        # Verify the updated answer or updated facts are reflected
        assert "DGCA" in ans_edit or "5 lakh" in ans_edit or "UPDATED" in ans_edit

        # 7. Unpublish the entry
        unpub_res = await client.post(f"/api/admin/knowledge-base/{item_id}/unpublish", headers=headers)
        assert unpub_res.status_code == 200
        assert unpub_res.json()["status"] == "draft"

        # 8. Check public AI Assistant query - UNPUBLISHED must NOT be retrieved!
        ans_unpub, _, ret_unpub, sources_unpub, _ = await generate_rag_answer(test_question)
        if ret_unpub:
            assert not any(s.get("title") == "Kisan Drone Subsidy Scheme" for s in sources_unpub)

        # 9. Delete the entry permanently
        del_res = await client.delete(f"/api/admin/knowledge-base/{item_id}", headers=headers)
        assert del_res.status_code == 200

@pytest.mark.asyncio
async def test_admin_user_management_search_filter_and_role_update():
    """Verify admin user listing with search, role filters, and role update."""
    await ensure_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Admin login
        from app.config import settings
        await client.post("/api/auth/admin/bootstrap", json={
            "bootstrap_key": settings.ADMIN_BOOTSTRAP_KEY,
            "email": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        admin_login = await client.post("/api/auth/login", json={
            "email_or_phone": "admin@ruralconnect.in",
            "password": "Admin@12345"
        })
        admin_token = admin_login.json()["access_token"]
        headers = {"Authorization": f"Bearer {admin_token}"}

        # 1. Register test user
        unique_id = str(uuid.uuid4().int)[:6]
        user_email = f"testuser_{unique_id}@test.com"
        reg_res = await client.post("/api/auth/register", json={
            "full_name": f"Test User {unique_id}",
            "email": user_email,
            "phone": f"97{unique_id}11",
            "password": "UserPass@123",
            "preferred_language": "en",
            "village": "Wai",
            "district": "Satara",
            "state": "Maharashtra",
            "business_type": "Dairy",
            "business_description": "Milk collection center.",
            "interests": ["Dairy & Livestock"]
        })
        assert reg_res.status_code == 200
        test_user_id = reg_res.json()["user"]["id"]

        # 2. List users with search
        search_res = await client.get(f"/api/admin/users?search={user_email}", headers=headers)
        assert search_res.status_code == 200
        found = search_res.json()
        assert len(found) >= 1
        assert found[0]["email"] == user_email.lower()

        # 3. Role update to admin
        role_res = await client.put(f"/api/admin/users/{test_user_id}/role", headers=headers, json={"role": "admin"})
        assert role_res.status_code == 200
        assert role_res.json()["role"] == "admin"

        # 4. Role update back to entrepreneur
        role_back = await client.put(f"/api/admin/users/{test_user_id}/role", headers=headers, json={"role": "entrepreneur"})
        assert role_back.status_code == 200
        assert role_back.json()["role"] == "entrepreneur"

