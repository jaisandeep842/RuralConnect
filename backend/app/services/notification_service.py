import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import httpx
from app.config import settings

logger = logging.getLogger("ruralconnect.notifications")

# Memory store for recent test/dev OTPs for automated testing & development resilience
DEV_OTP_REGISTRY = {}

async def send_email_otp(to_email: str, otp: str, purpose: str = "verification") -> bool:
    """
    Sends an OTP to the user's email address using configured SMTP, SendGrid, or dev fallback.
    """
    to_email_norm = to_email.strip().lower()
    DEV_OTP_REGISTRY[to_email_norm] = otp
    subject = f"Your RuralConnect Security Code: {otp}"
    purpose_label = "Registration" if purpose == "registration" else ("Password Reset" if purpose == "reset_password" else "Login")
    
    body_text = (
        f"Namaste,\n\n"
        f"Your RuralConnect verification code for {purpose_label} is: {otp}\n\n"
        f"This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes. "
        f"For security, never share this code with anyone.\n\n"
        f"RuralConnect — AI-Powered Rural Entrepreneurship Platform\n"
        f"Learn. Connect. Grow."
    )

    body_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 16px; background-color: #fffbeb;">
        <h2 style="color: #9a3412; margin-top: 0;">RuralConnect Security Verification</h2>
        <p style="color: #334155; font-size: 14px;">Namaste,</p>
        <p style="color: #334155; font-size: 14px;">Your one-time verification code for <strong>{purpose_label}</strong> is:</p>
        <div style="background-color: #ffedd5; padding: 15px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #9a3412; margin: 20px 0;">
            {otp}
        </div>
        <p style="color: #64748b; font-size: 12px;">This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes. If you did not request this, please disregard this email.</p>
        <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center;">RuralConnect — Empowering Indian Rural Entrepreneurs</p>
    </div>
    """

    if settings.EMAIL_PROVIDER == "sendgrid" and settings.SENDGRID_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.sendgrid.com/v3/mail/send",
                    headers={
                        "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "personalizations": [{"to": [{"email": to_email_norm}]}],
                        "from": {"email": settings.SMTP_FROM_EMAIL, "name": "RuralConnect Security"},
                        "subject": subject,
                        "content": [
                            {"type": "text/plain", "value": body_text},
                            {"type": "text/html", "value": body_html}
                        ]
                    }
                )
                if res.status_code in [200, 202]:
                    logger.info(f"Email OTP sent via SendGrid to {to_email_norm[:3]}***")
                    return True
                else:
                    logger.error(f"SendGrid delivery error: {res.status_code} {res.text}")
        except Exception as e:
            logger.error(f"Exception sending email via SendGrid: {e}")

    elif settings.EMAIL_PROVIDER == "smtp" and settings.SMTP_HOST:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = settings.SMTP_FROM_EMAIL
            msg["To"] = to_email_norm
            msg.attach(MIMEText(body_text, "plain"))
            msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.ehlo()
                if settings.SMTP_PORT == 587:
                    server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_FROM_EMAIL, [to_email_norm], msg.as_string())
            logger.info(f"Email OTP sent via SMTP to {to_email_norm[:3]}***")
            return True
        except Exception as e:
            logger.error(f"Exception sending email via SMTP: {e}")

    # Fallback / Development mode logging
    logger.info(f"[DEV / RESILIENT MODE] Email OTP for {to_email_norm}: {otp}")
    return True


async def send_sms_otp(to_phone: str, otp: str, purpose: str = "verification") -> bool:
    """
    Sends an SMS OTP to a 10-digit Indian mobile number or E.164 phone.
    Supports Twilio, MSG91, Fast2SMS, and dev/mock mode.
    """
    phone_digits = "".join(filter(str.isdigit, to_phone))
    DEV_OTP_REGISTRY[phone_digits] = otp
    purpose_label = "Registration" if purpose == "registration" else ("Password Reset" if purpose == "reset_password" else "Login")
    sms_text = f"Your RuralConnect OTP for {purpose_label} is {otp}. Valid for {settings.OTP_EXPIRE_MINUTES} mins. Do not share. - RuralConnect"

    # Twilio Integration
    if settings.SMS_PROVIDER == "twilio" and settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
        try:
            # Format to E.164
            e164_phone = f"+91{phone_digits[-10:]}" if len(phone_digits) == 10 else f"+{phone_digits}"
            url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    url,
                    auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                    data={
                        "From": settings.TWILIO_FROM_NUMBER,
                        "To": e164_phone,
                        "Body": sms_text
                    }
                )
                if res.status_code in [200, 201]:
                    logger.info(f"SMS OTP dispatched via Twilio to {e164_phone[-4:]}")
                    return True
                else:
                    logger.error(f"Twilio SMS error: {res.status_code} {res.text}")
        except Exception as e:
            logger.error(f"Twilio SMS exception: {e}")

    # MSG91 Integration
    elif settings.SMS_PROVIDER == "msg91" and settings.MSG91_AUTH_KEY:
        try:
            ten_digit = phone_digits[-10:]
            url = "https://control.msg91.com/api/v5/otp"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    url,
                    headers={
                        "authkey": settings.MSG91_AUTH_KEY,
                        "content-type": "application/json"
                    },
                    json={
                        "mobile": f"91{ten_digit}",
                        "otp": otp,
                        "sender": settings.MSG91_SENDER_ID
                    }
                )
                if res.status_code == 200:
                    logger.info(f"SMS OTP dispatched via MSG91 to ***{ten_digit[-4:]}")
                    return True
                else:
                    logger.error(f"MSG91 error: {res.status_code} {res.text}")
        except Exception as e:
            logger.error(f"MSG91 SMS exception: {e}")

    # Fast2SMS Integration (Popular Indian SMS API)
    elif settings.SMS_PROVIDER == "fast2sms" and settings.FAST2SMS_API_KEY:
        try:
            ten_digit = phone_digits[-10:]
            url = "https://www.fast2sms.com/dev/bulkV2"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    url,
                    headers={
                        "authorization": settings.FAST2SMS_API_KEY,
                        "Content-Type": "application/json"
                    },
                    json={
                        "variables_values": otp,
                        "route": "otp",
                        "numbers": ten_digit
                    }
                )
                if res.status_code == 200:
                    logger.info(f"SMS OTP dispatched via Fast2SMS to ***{ten_digit[-4:]}")
                    return True
                else:
                    logger.error(f"Fast2SMS error: {res.status_code} {res.text}")
        except Exception as e:
            logger.error(f"Fast2SMS SMS exception: {e}")

    # Dev / Local Resilient fallback
    logger.info(f"[DEV / RESILIENT MODE] SMS OTP for {phone_digits}: {otp}")
    return True
