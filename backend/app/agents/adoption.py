"""Agent 2 - Digital Adoption Agent"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class AdoptionAgent(BaseAgent):
    AGENT_TYPE = "adoption"
    AGENT_NAME = "Digital Adoption Agent"

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()

        if any(word in message_lower for word in ["yono", "app"]):
            return AgentResponse(
                response="""📱 **YONO - You Only Need One!**

Let me guide you through setting up SBI YONO:

**Step 1:** Download YONO SBI from Play Store / App Store
**Step 2:** Click "New User? Register Here"
**Step 3:** Enter your account number or CIF number
**Step 4:** Verify with registered mobile OTP
**Step 5:** Set your MPIN and login password

**What YONO gives you:**
• 💸 Instant fund transfers (UPI, NEFT, IMPS)
• 📊 Account statements & balance check
• 🛒 Shopping & lifestyle offers
• 🏦 Open FD/RD in 2 clicks
• 🔒 Card management & blocking
• 📱 Recharge & bill payments

**Pro Tip:** Enable biometric login for faster access!

Your YONO is 70% set up. **Shall I complete the remaining steps?**""",
                confidence=self._get_confidence(),
                suggestions=["Complete YONO setup", "Explore YONO features", "Enable UPI on YONO", "Set up auto-pay"],
            )
        elif any(word in message_lower for word in ["upi", "pay", "payment"]):
            return AgentResponse(
                response="""💳 **UPI Activation Guide**

Let's activate UPI on your SBI account:

**Quick Setup (3 minutes):**
1. Open YONO or any UPI app (Google Pay, PhonePe)
2. Select SBI as your bank
3. Verify with your debit card details
4. Set your UPI PIN (6 digits)
5. Your UPI ID: yourname@sbi ✅

**UPI Features Available:**
• ⚡ Instant transfers up to ₹1 lakh
• 📲 Scan & Pay at merchants
• 🔄 Request money from contacts
• 📅 Schedule recurring payments
• 💰 Check balance instantly

**Your UPI readiness: 85%** - Just need to set your PIN!""",
                confidence=self._get_confidence(),
                suggestions=["Set UPI PIN", "Link multiple accounts", "Set transaction limits", "View UPI offers"],
            )
        else:
            return AgentResponse(
                response="""🚀 **Digital Banking Adoption Assistant**

I'll help you go fully digital! Here's your digital readiness:

| Service | Status | Action |
|---|---|---|
| 📱 YONO App | ⚠️ Not Set Up | Set up now |
| 💳 UPI | ⚠️ Inactive | Activate |
| 🌐 Internet Banking | ✅ Active | - |
| 📧 e-Statements | ⚠️ Not Set | Enable |
| 🔔 SMS Alerts | ✅ Active | - |

**Your Digital Score: 45/100** - Let's improve this!

**I recommend starting with YONO setup** - it unlocks 80% of digital services.

What would you like to set up first?""",
                confidence=self._get_confidence(),
                suggestions=["Set up YONO", "Activate UPI", "Enable e-statements", "View all digital services"],
            )
