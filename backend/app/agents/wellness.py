"""Agent 4 - Financial Wellness Agent"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class WellnessAgent(BaseAgent):
    AGENT_TYPE = "wellness"
    AGENT_NAME = "Financial Wellness Agent"

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()

        if any(word in message_lower for word in ["budget", "spend", "expense"]):
            return AgentResponse(
                response="""📊 **Your Budget Analysis**

**Monthly Income:** ₹85,000
**Monthly Expenses:** ₹62,400
**Monthly Savings:** ₹22,600 (26.6%)

**Expense Breakdown:**
🏠 Rent/EMI: ₹22,000 (35.3%)
🍔 Food & Dining: ₹8,500 (13.6%)
🚗 Transport & Fuel: ₹5,200 (8.3%)
🛒 Shopping: ₹7,800 (12.5%)
📱 Utilities & Bills: ₹4,900 (7.9%)
🎬 Entertainment: ₹3,500 (5.6%)
💊 Healthcare: ₹2,000 (3.2%)
📚 Education: ₹3,500 (5.6%)
🔄 Others: ₹5,000 (8.0%)

⚠️ **Alert:** Shopping expenses are 18% higher than last month.

💡 **AI Suggestions:**
1. Reduce dining out by ₹2,000 → save ₹24,000/year
2. Switch to annual insurance → save ₹3,400/year
3. Start SIP with extra savings → potential 12% returns

**Your Savings Rate: 26.6%** (Good! Target: 30%)""",
                confidence=self._get_confidence(),
                suggestions=["Set budget limits", "Start a SIP", "Track recurring expenses", "Get savings tips"],
            )
        elif any(word in message_lower for word in ["invest", "sip", "mutual fund", "wealth"]):
            return AgentResponse(
                response="""💰 **Investment Recommendations**

Based on your risk profile (**Moderate**) and goals:

**Recommended Portfolio:**

| Investment | Monthly | Expected Return | Risk |
|---|---|---|---|
| 🔵 SBI Bluechip Fund | ₹5,000 | 12-15% p.a. | Medium |
| 🟢 SBI Small Cap Fund | ₹3,000 | 15-18% p.a. | High |
| 🟡 SBI Magnum Gilt Fund | ₹2,000 | 7-8% p.a. | Low |
| 💛 PPF | ₹12,500 | 7.1% p.a. | Zero |
| 🏦 SBI FD (1 Year) | - | 7.0% p.a. | Zero |

**Tax Benefits Available:**
• Section 80C: ₹1,50,000 limit → You've used ₹95,000
• Gap: ₹55,000 → Invest in PPF/ELSS to save ₹16,500 in tax!

**Projected Wealth (10 years):**
Monthly SIP of ₹10,000 → **₹23.2 Lakhs** (at 12% CAGR)

Start your SIP today?""",
                confidence=self._get_confidence(),
                suggestions=["Start recommended SIP", "Compare mutual funds", "Tax saving options", "Set investment goals"],
                products=[
                    {"type": "mutual_fund", "name": "SBI Bluechip Fund", "match_score": 0.94},
                    {"type": "sip", "name": "SBI Small Cap Fund", "match_score": 0.87},
                    {"type": "ppf", "name": "PPF Account", "match_score": 0.91},
                ]
            )
        else:
            return AgentResponse(
                response="""❤️ **Your Financial Wellness Score: 72/100**

**Score Breakdown:**
• 💰 Savings: 78/100 ✅ Good savings ratio
• 📊 Investments: 65/100 ⚠️ Needs diversification
• 🛡️ Insurance: 60/100 ⚠️ Health insurance gap
• 💳 Debt: 82/100 ✅ Healthy debt-to-income
• 🎯 Goals: 70/100 ⚠️ Retirement planning needed
• 🏦 Emergency Fund: 75/100 ✅ 4.5 months covered

**Top 3 Improvements:**
1. 🛡️ Get health insurance (₹500/month) → +8 points
2. 📊 Start equity SIP (₹5,000/month) → +6 points
3. 🎯 Set up retirement goal → +4 points

**Following these can improve your score to 90/100!**

What area would you like to focus on?""",
                confidence=self._get_confidence(),
                suggestions=["Improve investment score", "Get insurance quote", "Set retirement goal", "View detailed analysis"],
            )
