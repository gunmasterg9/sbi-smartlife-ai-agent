"""Agent 1 - Customer Acquisition Agent"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class AcquisitionAgent(BaseAgent):
    AGENT_TYPE = "acquisition"
    AGENT_NAME = "Customer Acquisition Agent"

    RESPONSES = {
        "open account": AgentResponse(
            response="""🏦 **Welcome to SBI! Let me help you open an account.**

I'd be happy to guide you through our seamless digital account opening process.

**Here's what you'll need:**
1. **PAN Card** - For identity verification
2. **Aadhaar Card** - For e-KYC (linked mobile number required)
3. **Passport-size photo** - Digital copy works
4. **Address proof** - Aadhaar/utility bill

**Account Options I Recommend Based on Your Profile:**

| Account Type | Min Balance | Benefits |
|---|---|---|
| 🌟 **SBI Savings Plus** | ₹3,000 | Higher interest, free debit card |
| 💼 **SBI Salary Account** | Zero | No min balance, premium debit card |
| 🎓 **SBI Youth Account** | ₹500 | Special for 18-25 age group |

**Would you like to start the e-KYC process right now?** I can verify your Aadhaar in under 2 minutes!""",
            confidence=0.95,
            suggestions=["Start e-KYC verification", "Compare account types", "Check eligibility for salary account", "View account benefits"],
            products=[
                {"type": "savings_account", "name": "SBI Savings Plus", "match_score": 0.92},
                {"type": "savings_account", "name": "SBI Salary Account", "match_score": 0.88},
            ]
        ),
        "kyc": AgentResponse(
            response="""📋 **KYC Verification - Let's Get You Verified!**

SBI offers multiple KYC verification methods:

1. **🔐 Aadhaar e-KYC** (Fastest - 2 minutes)
   - OTP-based verification
   - No documents to upload
   - Instantly verified

2. **📹 Video KYC** (5 minutes)
   - Live video call with SBI representative
   - Show original documents
   - Available 9 AM - 8 PM

3. **🏢 In-Branch KYC**
   - Visit nearest SBI branch
   - Carry original documents
   - Same-day verification

**Your nearest SBI branch:** SBI Main Branch, MG Road - 1.2 km away

Which method would you prefer?""",
            confidence=0.93,
            suggestions=["Start Aadhaar e-KYC", "Schedule Video KYC", "Find nearest branch", "Check required documents"],
        ),
        "default": AgentResponse(
            response="""👋 **Hello! I'm your SBI Customer Acquisition Assistant.**

I can help you with:

🏦 **Account Opening** - Savings, Current, Salary, FD, RD accounts
📋 **KYC Verification** - e-KYC, Video KYC, or in-branch
✅ **Eligibility Checks** - Check what products you qualify for
🎯 **Product Recommendations** - Personalized based on your profile
📱 **Digital Onboarding** - YONO app, Internet Banking, Mobile Banking

I use AI to analyze your profile and recommend the best banking products for you.

**What would you like to do today?**""",
            confidence=0.90,
            suggestions=["Open a new account", "Check my eligibility", "Compare products", "Start KYC verification"],
        ),
    }

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["open", "account", "new", "create"]):
            resp = self.RESPONSES["open account"]
        elif any(word in message_lower for word in ["kyc", "verify", "document", "aadhaar"]):
            resp = self.RESPONSES["kyc"]
        else:
            resp = self.RESPONSES["default"]
        
        resp.confidence = self._get_confidence()
        return resp
