"""
SBI SmartLife AI Agent - Demo Data Seed Generator
Generates 500 realistic Indian customers with full banking data
"""
import uuid
import random
from datetime import datetime, timedelta, date
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import sys
import os

# Fix Windows console encoding for emoji characters
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass  # Python < 3.7

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import Base
from app.models.user import User, UserRole
from app.models.customer import CustomerProfile, CustomerSegment
from app.models.digital_twin import DigitalTwin
from app.models.account import Account, AccountType, AccountStatus
from app.models.transaction import Transaction, TransactionType, TransactionCategory
from app.models.goal import Goal, GoalType, GoalStatus
from app.models.investment import Investment, InvestmentType
from app.models.insurance import Insurance, InsuranceType
from app.models.loan import Loan, LoanType, LoanStatus
from app.models.life_event import LifeEvent, LifeEventType
from app.models.recommendation import Recommendation, RecommendationType, RecommendationStatus
from app.models.engagement import EngagementLog
from app.models.agent_action import AgentAction
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.models.kyc_document import KYCDocument
from app.models.support_interaction import SupportInteraction
from app.models.financial_score import FinancialScore

from app.middleware.auth import hash_password

fake = Faker("en_IN")

# Indian names and data
INDIAN_FIRST_NAMES_M = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
                         "Shaurya", "Atharv", "Advik", "Pranav", "Advaith", "Aarush", "Kabir", "Ritvik", "Rohan", "Aryan",
                         "Vikram", "Ravi", "Suresh", "Rajesh", "Mahesh", "Deepak", "Ajay", "Vijay", "Ramesh", "Ganesh",
                         "Karthik", "Sundar", "Mohan", "Gopal", "Ashok", "Nikhil", "Rahul", "Amit", "Sachin", "Vishal"]

INDIAN_FIRST_NAMES_F = ["Ananya", "Aadhya", "Saanvi", "Aanya", "Myra", "Aarohi", "Priya", "Sneha", "Divya", "Kavya",
                         "Meera", "Pooja", "Neha", "Anjali", "Riya", "Nisha", "Preeti", "Swati", "Deepa", "Lata",
                         "Sunita", "Rekha", "Geeta", "Sita", "Lakshmi", "Rani", "Padma", "Usha", "Savita", "Radha"]

INDIAN_LAST_NAMES = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Nair", "Iyer", "Rao",
                      "Joshi", "Mishra", "Pandey", "Agarwal", "Mehta", "Shah", "Desai", "Bhat", "Menon", "Pillai",
                      "Chopra", "Kapoor", "Malhotra", "Srivastava", "Tiwari", "Saxena", "Bansal", "Goyal", "Jain", "Chawla"]

CITIES = [("Mumbai", "Maharashtra"), ("Delhi", "Delhi"), ("Bangalore", "Karnataka"), ("Hyderabad", "Telangana"),
          ("Chennai", "Tamil Nadu"), ("Kolkata", "West Bengal"), ("Pune", "Maharashtra"), ("Ahmedabad", "Gujarat"),
          ("Jaipur", "Rajasthan"), ("Lucknow", "Uttar Pradesh"), ("Surat", "Gujarat"), ("Indore", "Madhya Pradesh"),
          ("Bhopal", "Madhya Pradesh"), ("Chandigarh", "Punjab"), ("Kochi", "Kerala"), ("Coimbatore", "Tamil Nadu"),
          ("Visakhapatnam", "Andhra Pradesh"), ("Nagpur", "Maharashtra"), ("Vadodara", "Gujarat"), ("Patna", "Bihar")]

OCCUPATIONS = ["Software Engineer", "Doctor", "Teacher", "Business Owner", "Government Employee",
               "Chartered Accountant", "Lawyer", "Bank Employee", "Sales Executive", "Marketing Manager",
               "Civil Engineer", "Architect", "Pharmacist", "Freelancer", "Professor", "Consultant",
               "Shop Owner", "Factory Worker", "Driver", "Farmer", "Retired"]

EMPLOYERS = ["TCS", "Infosys", "Wipro", "HCL", "Reliance", "HDFC Bank", "ICICI Bank", "SBI",
             "L&T", "Mahindra", "Tata Motors", "ITC", "Asian Paints", "Bajaj", "Self-Employed",
             "Government of India", "State Government", "Indian Railways", "ONGC", "BHEL"]

MERCHANTS = {
    "food": ["Swiggy", "Zomato", "Dominos", "McDonald's", "KFC", "Pizza Hut", "Starbucks", "Haldirams"],
    "groceries": ["BigBasket", "Blinkit", "DMart", "Reliance Fresh", "More Supermarket", "Star Bazaar"],
    "shopping": ["Amazon", "Flipkart", "Myntra", "Ajio", "Nykaa", "Croma", "Reliance Digital"],
    "utilities": ["BESCOM", "BSNL", "Jio", "Airtel", "Tata Power", "Mahanagar Gas", "MTNL"],
    "fuel": ["HP Petrol Pump", "Indian Oil", "Bharat Petroleum", "Shell"],
    "entertainment": ["Netflix", "Amazon Prime", "Hotstar", "BookMyShow", "PVR Cinemas", "Spotify"],
    "healthcare": ["Apollo Pharmacy", "MedPlus", "1mg", "Practo", "Fortis Hospital"],
    "education": ["Byju's", "Unacademy", "Coursera", "NIIT", "School Fees"],
    "travel": ["MakeMyTrip", "IRCTC", "Ola", "Uber", "IndiGo", "Air India"],
}

LANGUAGES = ["english", "hindi", "gujarati", "marathi", "tamil", "telugu", "bengali"]

def generate_pan():
    """Generate a realistic PAN number pattern"""
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return f"{random.choice(letters)}{random.choice(letters)}{random.choice(letters)}P{random.choice(letters)}{random.randint(1000,9999)}{random.choice(letters)}"

def generate_account_number():
    """Generate SBI-style account number"""
    return f"{random.randint(10000, 99999)}{random.randint(100000, 999999)}"

def seed_database(db_url: str = None):
    """Generate and insert all demo data"""
    if db_url is None:
        db_url = os.getenv("DATABASE_SYNC_URL", "postgresql://sbi_user:sbi_password@localhost:5432/sbi_smartlife")

    try:
        engine = create_engine(db_url)
        # Test connection
        with engine.connect() as conn:
            pass
    except Exception as e:
        if "postgresql" in db_url:
            print(f"⚠️ Failed to connect to PostgreSQL: {e}. Falling back to SQLite local database...")
            db_url = "sqlite:///./sbi_smartlife.db"
            engine = create_engine(db_url)
        else:
            raise e

    Base.metadata.create_all(engine)

    with Session(engine) as db:
        print("🚀 Starting SBI SmartLife data generation...")

        # Create admin user
        admin = User(
            id=uuid.uuid4(),
            email="admin@sbi-smartlife.ai",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

        # Create demo customer user for login
        demo_user = User(
            id=uuid.uuid4(),
            email="demo@sbi-smartlife.ai",
            password_hash=hash_password("demo123"),
            role=UserRole.CUSTOMER,
            is_active=True,
            is_verified=True,
        )
        db.add(demo_user)
        db.flush()

        print("✅ Admin and demo users created")

        # Generate 500 customers
        customers = []
        all_accounts = []
        
        for i in range(500):
            gender = random.choice(["male", "female"])
            first_name = random.choice(INDIAN_FIRST_NAMES_M if gender == "male" else INDIAN_FIRST_NAMES_F)
            last_name = random.choice(INDIAN_LAST_NAMES)
            city, state = random.choice(CITIES)

            income_bracket = random.choices(
                [25000, 50000, 85000, 150000, 300000, 500000],
                weights=[15, 30, 25, 15, 10, 5],
                k=1
            )[0]
            monthly_income = income_bracket + random.randint(-5000, 15000)

            segment = (
                CustomerSegment.MASS if monthly_income < 50000
                else CustomerSegment.MASS_AFFLUENT if monthly_income < 100000
                else CustomerSegment.AFFLUENT if monthly_income < 250000
                else CustomerSegment.HNI if monthly_income < 500000
                else CustomerSegment.ULTRA_HNI
            )

            # Create user
            user = User(
                id=uuid.uuid4() if i > 0 else demo_user.id,
                email=f"{first_name.lower()}.{last_name.lower()}{i}@email.com" if i > 0 else demo_user.email,
                password_hash=hash_password("password123") if i > 0 else demo_user.password_hash,
                role=UserRole.CUSTOMER,
                is_active=True,
                is_verified=random.choice([True, True, True, False]),
                last_login=fake.date_time_between(start_date="-30d", end_date="now"),
            )
            if i > 0:
                db.add(user)
                db.flush()

            user_id = user.id if i > 0 else demo_user.id

            # Create customer profile
            yono = random.choice(["true", "true", "true", "false"])
            upi = random.choice(["true", "true", "true", "true", "false"])

            customer = CustomerProfile(
                id=uuid.uuid4(),
                user_id=user_id,
                first_name=first_name,
                last_name=last_name,
                date_of_birth=fake.date_of_birth(minimum_age=22, maximum_age=65),
                gender=gender,
                marital_status=random.choice(["single", "married", "married", "married"]),
                address=fake.address(),
                city=city,
                state=state,
                pincode=str(random.randint(100000, 999999)),
                pan_number=generate_pan(),
                aadhaar_hash=str(uuid.uuid4()),
                kyc_status=random.choice(["verified", "verified", "verified", "pending"]),
                occupation=random.choice(OCCUPATIONS),
                employer=random.choice(EMPLOYERS),
                annual_income=monthly_income * 12,
                monthly_income=monthly_income,
                segment=segment,
                risk_appetite=random.choice(["conservative", "moderate", "moderate", "aggressive"]),
                preferred_language=random.choice(LANGUAGES),
                yono_registered=yono,
                upi_active=upi,
                mobile_banking=random.choice(["true", "true", "false"]),
                internet_banking=random.choice(["true", "true", "false"]),
                customer_since=fake.date_between(start_date="-10y", end_date="-6m"),
                branch_code=f"SBI{random.randint(1000, 9999)}",
            )
            db.add(customer)
            customers.append(customer)

            # Create 1-3 accounts per customer
            num_accounts = random.choices([1, 2, 3], weights=[40, 40, 20], k=1)[0]
            for j in range(num_accounts):
                acct_type = AccountType.SAVINGS if j == 0 else random.choice(list(AccountType))
                balance = random.uniform(5000, monthly_income * 6)
                account = Account(
                    id=uuid.uuid4(),
                    customer_id=customer.id,
                    account_number=generate_account_number(),
                    account_type=acct_type,
                    status=AccountStatus.ACTIVE,
                    balance=round(balance, 2),
                    available_balance=round(balance, 2),
                    branch_code=customer.branch_code,
                    ifsc_code=f"SBIN00{random.randint(10000, 99999)}",
                    interest_rate=random.choice([2.7, 3.0, 3.5, 7.0, 7.1]),
                    is_primary=(j == 0),
                    opened_at=fake.date_time_between(start_date="-5y", end_date="-1m"),
                )
                db.add(account)
                all_accounts.append(account)

            if i % 100 == 0:
                db.flush()
                print(f"  📝 {i}/500 customers created...")

        db.flush()
        print("✅ 500 customers created with accounts")

        # Generate transactions (100 per customer avg = 50,000 total)
        print("💰 Generating transactions...")
        for idx, account in enumerate(all_accounts):
            num_txns = random.randint(30, 150)
            customer = next((c for c in customers if c.id == account.customer_id), None)
            monthly_income = customer.monthly_income or 50000

            for _ in range(num_txns):
                is_credit = random.random() < 0.3
                if is_credit:
                    txn_type = TransactionType.CREDIT
                    category = random.choice([TransactionCategory.SALARY, TransactionCategory.TRANSFER, TransactionCategory.OTHER])
                    amount = monthly_income if category == TransactionCategory.SALARY else random.uniform(500, 50000)
                    merchant = customer.employer if category == TransactionCategory.SALARY else None
                else:
                    txn_type = random.choice([TransactionType.DEBIT, TransactionType.UPI, TransactionType.POS])
                    category = random.choice(list(TransactionCategory)[1:])  # Skip SALARY
                    cat_name = category.value
                    amount = {
                        "food": (100, 2000), "groceries": (200, 5000), "shopping": (500, 15000),
                        "utilities": (200, 5000), "rent": (8000, 30000), "emi": (5000, 50000),
                        "insurance": (500, 10000), "investment": (1000, 50000),
                        "entertainment": (100, 3000), "travel": (200, 20000),
                        "healthcare": (100, 10000), "education": (500, 20000),
                        "fuel": (500, 3000), "transfer": (500, 50000), "atm_withdrawal": (500, 10000),
                        "other": (100, 5000),
                    }.get(cat_name, (100, 5000))
                    amount = round(random.uniform(*amount), 2)
                    merchants = MERCHANTS.get(cat_name, ["Unknown Merchant"])
                    merchant = random.choice(merchants) if merchants else None

                txn = Transaction(
                    id=uuid.uuid4(),
                    account_id=account.id,
                    transaction_type=txn_type,
                    category=category,
                    amount=round(amount, 2),
                    description=f"{'Credit' if is_credit else 'Payment'} - {merchant or category.value}",
                    merchant_name=merchant,
                    is_recurring=random.choice(["true", "false", "false", "false"]),
                    timestamp=fake.date_time_between(start_date="-6m", end_date="now"),
                )
                db.add(txn)

            if idx % 200 == 0:
                db.flush()

        db.flush()
        print("✅ Transactions generated")

        # Generate Digital Twins
        print("🧬 Creating Digital Twins...")
        for customer in customers:
            categories = ["food", "shopping", "utilities", "travel", "entertainment", "healthcare"]
            spending = {cat: round(random.uniform(2000, 15000), 2) for cat in categories}

            twin = DigitalTwin(
                id=uuid.uuid4(),
                customer_id=customer.id,
                spending_profile=spending,
                saving_pattern={"monthly_avg": round(random.uniform(5000, 30000), 2), "trend": random.choice(["increasing", "stable", "decreasing"])},
                income_trend={"direction": random.choice(["growing", "stable"]), "growth_rate": round(random.uniform(0.05, 0.20), 2)},
                risk_score=round(random.uniform(20, 85), 1),
                financial_health_score=round(random.uniform(40, 95), 1),
                engagement_score=round(random.uniform(30, 95), 1),
                digital_maturity_score=round(random.uniform(25, 95), 1),
                churn_probability=round(random.uniform(0.02, 0.35), 2),
                predicted_needs=random.sample(["home_loan", "sip", "credit_card", "insurance", "fd", "vehicle_loan", "education_loan"], k=random.randint(2, 4)),
                predicted_life_events=random.sample(["salary_increase", "marriage", "home_purchase", "child_education", "retirement"], k=random.randint(1, 3)),
                personality_traits={"risk_tolerance": random.choice(["low", "medium", "high"]), "tech_savvy": random.choice(["low", "medium", "high"]), "loyalty": random.choice(["medium", "high"])},
                confidence=round(random.uniform(0.7, 0.95), 2),
            )
            db.add(twin)
        db.flush()
        print("✅ Digital Twins created")

        # Generate recommendations, life events, scores, etc.
        print("📋 Generating recommendations, life events, scores...")
        
        agent_types = ["acquisition", "adoption", "engagement", "wellness", "life_events", "relationship"]
        
        for customer in customers:
            # Recommendations (2-5 per customer)
            for _ in range(random.randint(2, 5)):
                rec_type = random.choice(list(RecommendationType))
                rec = Recommendation(
                    id=uuid.uuid4(),
                    customer_id=customer.id,
                    agent_type=random.choice(agent_types),
                    recommendation_type=rec_type,
                    status=random.choice(list(RecommendationStatus)),
                    title=f"Recommended: {rec_type.value.replace('_', ' ').title()}",
                    description=f"Based on your financial profile, we recommend exploring {rec_type.value.replace('_', ' ')} options.",
                    reasoning=f"Your spending patterns and goals suggest this product can help you achieve better financial outcomes.",
                    match_score=round(random.uniform(0.6, 0.98), 2),
                    priority=random.choice(["low", "medium", "high"]),
                    product_details={"estimated_benefit": f"₹{random.randint(1000, 50000)}/year"},
                    trigger_event=random.choice(["spending_analysis", "life_event", "digital_twin", "engagement_pattern"]),
                    created_at=fake.date_time_between(start_date="-30d", end_date="now"),
                )
                db.add(rec)

            # Life events (0-3 per customer)
            for _ in range(random.randint(0, 3)):
                event = LifeEvent(
                    id=uuid.uuid4(),
                    customer_id=customer.id,
                    event_type=random.choice(list(LifeEventType)),
                    description="AI-detected life event based on transaction patterns",
                    confidence_score=round(random.uniform(0.5, 0.95), 2),
                    detection_method=random.choice(["transaction_analysis", "behavioral_pattern", "income_change", "spending_shift"]),
                    evidence={"signals": ["income_change", "search_pattern"], "data_points": random.randint(5, 20)},
                    action_taken=random.choice(["pending", "notified", "acted"]),
                    detected_at=fake.date_time_between(start_date="-60d", end_date="now"),
                )
                db.add(event)

            # Financial Score
            score = FinancialScore(
                id=uuid.uuid4(),
                customer_id=customer.id,
                wellness_score=round(random.uniform(35, 95), 1),
                credit_score=round(random.uniform(600, 850), 0),
                engagement_score=round(random.uniform(30, 95), 1),
                risk_score=round(random.uniform(20, 80), 1),
                digital_score=round(random.uniform(25, 95), 1),
                savings_ratio=round(random.uniform(0.1, 0.4), 2),
                debt_to_income=round(random.uniform(0.1, 0.5), 2),
                investment_diversity=round(random.uniform(0.2, 0.9), 2),
                insurance_coverage=round(random.uniform(0.3, 1.0), 2),
                emergency_fund_months=round(random.uniform(1, 12), 1),
                score_trend=random.choice(["improving", "stable", "declining"]),
                improvement_suggestions=[
                    "Increase SIP contributions for better long-term wealth creation",
                    "Consider health insurance for comprehensive coverage",
                    "Build emergency fund to cover 6 months of expenses",
                ],
                computed_at=datetime.utcnow(),
            )
            db.add(score)

            # Goals (1-3 per customer)
            for _ in range(random.randint(1, 3)):
                goal_type = random.choice(list(GoalType))
                target = random.choice([100000, 500000, 1000000, 2500000, 5000000])
                progress = round(random.uniform(0.05, 0.85), 2)
                goal = Goal(
                    id=uuid.uuid4(),
                    customer_id=customer.id,
                    name=f"{goal_type.value.replace('_', ' ').title()} Fund",
                    goal_type=goal_type,
                    status=GoalStatus.ACTIVE,
                    target_amount=target,
                    current_amount=round(target * progress, 2),
                    monthly_contribution=round(random.uniform(2000, 20000), 0),
                    deadline=fake.date_between(start_date="+6m", end_date="+10y"),
                    priority=random.choice(["low", "medium", "high"]),
                    progress_percentage=round(progress * 100, 1),
                )
                db.add(goal)

            # Engagement logs (5-20 per customer)
            for _ in range(random.randint(5, 20)):
                engagement = EngagementLog(
                    id=uuid.uuid4(),
                    customer_id=customer.id,
                    channel=random.choice(["app", "web", "sms", "email", "whatsapp", "branch", "call"]),
                    action=random.choice(["login", "balance_check", "fund_transfer", "bill_payment", "product_view", "offer_click", "sip_setup", "fd_inquiry"]),
                    page=random.choice(["/dashboard", "/transfers", "/investments", "/offers", "/profile", "/loans"]),
                    device_type=random.choice(["mobile", "desktop", "tablet"]),
                    timestamp=fake.date_time_between(start_date="-30d", end_date="now"),
                )
                db.add(engagement)

        db.flush()
        print("✅ Recommendations, life events, goals, and engagement generated")

        # Generate agent actions
        print("🤖 Generating agent actions...")
        agent_action_types = {
            "acquisition": ["Lead qualified", "KYC initiated", "Account recommendation sent", "Eligibility checked"],
            "adoption": ["YONO setup guided", "UPI activation assisted", "Digital service explained", "Tutorial provided"],
            "engagement": ["Offer personalized", "Reward suggested", "Retention risk flagged", "Engagement scored"],
            "wellness": ["Budget analyzed", "Investment suggested", "Goal created", "Score computed"],
            "life_events": ["Event detected", "Prediction generated", "Recommendation triggered", "Pattern analyzed"],
            "relationship": ["Query resolved", "Account summary provided", "Loan options presented", "Language switched"],
        }

        for agent_type, actions in agent_action_types.items():
            for _ in range(random.randint(50, 200)):
                action = AgentAction(
                    id=uuid.uuid4(),
                    agent_type=agent_type,
                    agent_name=f"{agent_type.replace('_', ' ').title()} Agent",
                    customer_id=random.choice(customers).id,
                    action=random.choice(actions),
                    status="completed",
                    duration_ms=random.randint(80, 2000),
                    confidence=round(random.uniform(0.75, 0.98), 2),
                    model_used="gemini-2.5-flash",
                    timestamp=fake.date_time_between(start_date="-30d", end_date="now"),
                )
                db.add(action)

        db.flush()
        print("✅ Agent actions generated")

        # Generate audit logs
        print("📝 Generating audit logs...")
        for _ in range(500):
            audit = AuditLog(
                id=uuid.uuid4(),
                user_id=random.choice([admin.id, demo_user.id]),
                action=random.choice(["login", "data_access", "data_export", "settings_change", "user_create", "report_generate"]),
                resource_type=random.choice(["customer", "account", "transaction", "report", "system"]),
                status="success",
                risk_level=random.choice(["low", "low", "low", "medium", "high"]),
                ip_address=fake.ipv4(),
                timestamp=fake.date_time_between(start_date="-30d", end_date="now"),
            )
            db.add(audit)

        db.flush()

        # Commit everything
        db.commit()
        print("\n🎉 Database seeding complete!")
        print(f"  👥 500 customers")
        print(f"  🏦 {len(all_accounts)} accounts")
        print(f"  💰 ~50,000 transactions")
        print(f"  🧬 500 digital twins")
        print(f"  📋 ~1,500 recommendations")
        print(f"  🔮 ~750 life events")
        print(f"  🎯 ~1,000 goals")
        print(f"  📊 500 financial scores")
        print(f"  🤖 ~750 agent actions")
        print(f"  📝 500 audit logs")
        print(f"\n  📧 Demo login: demo@sbi-smartlife.ai / demo123")
        print(f"  👤 Admin login: admin@sbi-smartlife.ai / admin123")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Seed SBI SmartLife database")
    parser.add_argument("--db-url", type=str, help="Database URL", default=None)
    args = parser.parse_args()
    seed_database(args.db_url)
