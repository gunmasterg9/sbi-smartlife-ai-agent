"""Agent 3 - Customer Engagement Agent"""
from app.agents.base import BaseAgent, AgentResponse
from typing import Dict, Any


class EngagementAgent(BaseAgent):
    AGENT_TYPE = "engagement"
    AGENT_NAME = "Customer Engagement Agent"

    async def _simulated_process(self, message: str, context: Dict[str, Any] = None) -> AgentResponse:
        message_lower = message.lower()

        if any(word in message_lower for word in ["offer", "deal", "reward", "cashback"]):
            return AgentResponse(
                response="""🎁 **Exclusive Offers Curated For You!**

Based on your spending patterns, here are your top offers:

1. 🛒 **Amazon Shopping** - Extra 10% cashback on SBI Credit Card (up to ₹1,500)
2. ✈️ **MakeMyTrip** - ₹2,000 off on flights booked via YONO
3. ⛽ **Fuel Cashback** - 5% cashback at HP/Indian Oil (up to ₹250/month)
4. 🍕 **Swiggy/Zomato** - 20% off on orders above ₹500
5. 📱 **Mobile Recharge** - ₹50 cashback on recharges via SBI UPI

**Loyalty Points Balance: 12,450 points** (Worth ₹3,112)

💡 **Pro Tip:** You have enough points to redeem an Amazon voucher worth ₹3,000!

Would you like to redeem your points or explore more offers?""",
                confidence=self._get_confidence(),
                suggestions=["Redeem loyalty points", "View all offers", "Set offer alerts", "Track cashback"],
            )
        else:
            return AgentResponse(
                response="""💫 **Your Engagement Dashboard**

Here's what's happening with your SBI accounts:

📊 **Activity Summary (This Month):**
• 34 transactions completed
• ₹2.4L total spending
• 12 UPI payments
• 3 bill payments

🏆 **Your Engagement Score: 78/100** (+5 from last month!)

🔔 **What's New:**
• New SIP started - ₹5,000/month ✅
• FD maturity in 15 days - ₹1,50,000
• Credit card bill due: 25th June - ₹18,450

💡 **Quick Actions Available:**
• Pay credit card bill now
• Renew your FD at 7.1% interest
• Explore investment opportunities

What would you like to do?""",
                confidence=self._get_confidence(),
                suggestions=["Pay credit card bill", "View spending analysis", "Check offers", "Manage investments"],
            )
