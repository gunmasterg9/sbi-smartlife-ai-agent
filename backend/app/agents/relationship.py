"""Agent 6 - AI Relationship Manager"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class RelationshipAgent(BaseAgent):
    AGENT_TYPE = "relationship"
    AGENT_NAME = "AI Relationship Manager"

    GREETINGS = {
        "hindi": "नमस्ते! मैं आपका SBI AI रिलेशनशिप मैनेजर हूं। मैं आपकी कैसे मदद कर सकता हूं?",
        "gujarati": "નમસ્તે! હું તમારો SBI AI રિલેશનશિપ મેનેજર છું. હું તમારી કેવી રીતે મદદ કરી શકું?",
        "marathi": "नमस्कार! मी तुमचा SBI AI रिलेशनशिप मॅनेजर आहे. मी तुम्हाला कशी मदत करू शकतो?",
        "tamil": "வணக்கம்! நான் உங்கள் SBI AI உறவு மேலாளர். நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        "telugu": "నమస్కారం! నేను మీ SBI AI రిలేషన్‌షిప్ మేనేజర్. నేను మీకు ఎలా సహాయం చేయగలను?",
        "bengali": "নমস্কার! আমি আপনার SBI AI রিলেশনশিপ ম্যানেজার। আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    }

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()
        language = (context or {}).get("language", "english")

        if any(word in message_lower for word in ["balance", "check", "account"]):
            return AgentResponse(
                response="""🏦 **Your Account Summary**

**Savings Account (XXXX4521)**
• Available Balance: **₹2,34,567.89**
• Last Transaction: ₹5,000 (UPI - Swiggy) on 20 Jun

**Fixed Deposit**
• FD Amount: ₹5,00,000 @ 7.1% p.a.
• Maturity: 15 Dec 2026
• Interest Earned: ₹23,456

**Credit Card (XXXX8934)**
• Outstanding: ₹18,450
• Due Date: 25 Jun 2026
• Available Limit: ₹2,81,550

**Total Relationship Value: ₹7,58,024**

⚡ Quick tip: Pay your credit card bill before 25th to avoid interest charges.

What else would you like to know?""",
                confidence=self._get_confidence(),
                suggestions=["Pay credit card bill", "View detailed statement", "Transfer funds", "Check FD rates"],
            )
        elif any(word in message_lower for word in ["loan", "emi", "borrow"]):
            return AgentResponse(
                response="""💰 **Pre-Approved Loan Offers For You**

Based on your credit score (785) and relationship:

| Loan Type | Amount | Rate | EMI | Tenure |
|---|---|---|---|---|
| 🏠 Home Loan | ₹50L | 8.5% | ₹43,391 | 20 yrs |
| 🚗 Car Loan | ₹8L | 8.9% | ₹16,263 | 5 yrs |
| 💼 Personal Loan | ₹12L | 10.5% | ₹25,729 | 5 yrs |
| 🎓 Education Loan | ₹15L | 8.15% | - | Moratorium |

**Special Benefits:**
• Zero processing fee on home loans (limited period)
• Instant disbursement for personal loans
• Flexible EMI options available

Your EMI affordability: **₹25,000/month** (based on income)

Would you like to apply for any of these?""",
                confidence=self._get_confidence(),
                suggestions=["Apply for home loan", "Calculate EMI", "Check eligibility", "Compare loan options"],
                products=[
                    {"type": "home_loan", "name": "SBI Home Loan", "match_score": 0.91},
                    {"type": "personal_loan", "name": "SBI Xpress Credit", "match_score": 0.85},
                ]
            )
        elif language != "english" and language in self.GREETINGS:
            return AgentResponse(
                response=f"""{self.GREETINGS[language]}

🌐 **Multilingual Support Active - {language.title()}**

I can assist you in your preferred language with:
• Account inquiries
• Fund transfers  
• Loan applications
• Investment guidance
• General banking help

Please tell me how I can help you today!""",
                confidence=self._get_confidence(),
                suggestions=["Check balance", "Transfer money", "View loans", "Investment options"],
            )
        else:
            return AgentResponse(
                response="""👋 **Welcome! I'm your AI Relationship Manager at SBI.**

Think of me as your personal banker, available 24/7.

**I can help you with:**
🏦 Account Management - Balance, statements, transfers
💰 Loans & Credit - Pre-approved offers, EMI calculators
📊 Investments - SIP, mutual funds, FD, PPF
🛡️ Insurance - Health, life, vehicle coverage
📱 Digital Banking - YONO, UPI, internet banking
🎯 Financial Planning - Goals, budgets, tax saving

**🌐 I speak:** English, हिंदी, ગુજરાતી, मराठी, தமிழ், తెలుగు, বাংলা

**Your Relationship Summary:**
• Customer since: 2019
• Relationship Value: ₹7.58L
• Products: 4 active
• Engagement Score: 78/100

How can I assist you today?""",
                confidence=self._get_confidence(),
                suggestions=["Check my balance", "View loan offers", "Financial health check", "Speak in Hindi"],
            )
