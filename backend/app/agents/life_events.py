"""Agent 5 - Life Event Prediction Agent"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class LifeEventAgent(BaseAgent):
    AGENT_TYPE = "life_events"
    AGENT_NAME = "Life Event Prediction Agent"

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()

        if any(word in message_lower for word in ["salary", "income", "raise", "promotion"]):
            return AgentResponse(
                response="""📈 **Salary Increase Detected!**

I noticed your salary credit increased by **30%** (₹65,000 → ₹85,000).

**Congratulations! 🎉** Here's what I recommend:

**Immediate Actions:**
1. 💰 **Increase SIP by ₹5,000** → Invest the surplus
2. 🏦 **Start a tax-saving FD** → Save ₹15,000 in taxes
3. 🛡️ **Upgrade health insurance** → Better coverage for family

**Smart Money Moves:**
• 50-30-20 Rule: ₹42,500 needs / ₹25,500 wants / ₹17,000 savings
• Start an emergency fund top-up: ₹10,000/month
• Consider NPS for retirement: ₹5,000/month (additional ₹50K tax benefit)

**Projected Impact:**
Monthly extra savings: ₹20,000
Annual additional corpus: ₹2,40,000
5-year wealth creation: ₹15.8 Lakhs (at 12% returns)

Shall I set up these automatically?""",
                confidence=self._get_confidence(),
                suggestions=["Auto-increase SIP", "Set up tax-saving investments", "Update insurance", "Create financial plan"],
                products=[
                    {"type": "sip", "name": "Auto SIP Increase", "match_score": 0.96},
                    {"type": "tax_saving", "name": "ELSS Tax Saver", "match_score": 0.93},
                ]
            )
        elif any(word in message_lower for word in ["marriage", "wedding"]):
            return AgentResponse(
                response="""💒 **Marriage Planning Detected!**

Based on your recent searches and transactions, it looks like you may be planning a wedding!

**Smart Wedding Finance Plan:**

| Expense Category | Estimated | SBI Solution |
|---|---|---|
| 🏨 Venue & Catering | ₹5-8L | SBI Personal Loan @ 10.5% |
| 💍 Jewelry | ₹3-5L | SBI Gold Loan @ 7.5% |
| 📸 Photography | ₹50K-1L | YONO EMI Options |
| ✈️ Honeymoon | ₹1-2L | SBI Travel Card |

**What I Suggest:**
1. Start a dedicated wedding fund (RD: ₹15,000/month)
2. Pre-approved Personal Loan: ₹8,00,000 available
3. Joint account for wedding expenses
4. Gold loan for jewelry purchase (lower interest)

Need help with any of these?""",
                confidence=self._get_confidence(),
                suggestions=["Start wedding fund", "Check loan eligibility", "Open joint account", "View gold loan rates"],
            )
        else:
            return AgentResponse(
                response="""🔮 **Life Event Predictions Dashboard**

Based on AI analysis of your financial patterns:

**Detected Events:**
1. 📈 **Salary Increase** (92% confidence) - Recent income growth detected
2. 🏠 **Home Purchase Intent** (75% confidence) - Property search patterns
3. 📚 **Education Planning** (68% confidence) - School fee payments starting

**Upcoming Predictions:**
• 🚗 Vehicle purchase likely in 6-12 months
• 👶 Child-related expenses may increase
• 📊 Investment portfolio needs rebalancing

**Proactive Actions Taken:**
✅ Home loan pre-approval initiated
✅ Education planning SIP suggested
✅ Vehicle loan options prepared

Each prediction triggers personalized banking recommendations.

Want to explore any of these?""",
                confidence=self._get_confidence(),
                suggestions=["View home loan options", "Start education planning", "Check vehicle loan", "See all predictions"],
            )
