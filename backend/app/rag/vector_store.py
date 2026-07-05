"""
ChromaDB Vector Store — Document embedding and retrieval for RAG
"""
from typing import List, Dict, Any, Optional
from app.config import settings
import logging
import chromadb
from chromadb.config import Settings as ChromaSettings

logger = logging.getLogger("sbi_rag")


class VectorStore:
    """ChromaDB-based vector store for banking knowledge retrieval"""

    def __init__(self):
        self._client = None
        self._collection = None

    @property
    def client(self) -> chromadb.ClientAPI:
        if self._client is None:
            try:
                client_instance = chromadb.HttpClient(
                    host=settings.CHROMA_HOST,
                    port=settings.CHROMA_PORT,
                )
                # Verify that connection works
                client_instance.heartbeat()
                self._client = client_instance
                logger.info(f"Connected to ChromaDB at {settings.CHROMA_HOST}:{settings.CHROMA_PORT}")
            except Exception as e:
                logger.warning(f"ChromaDB remote unavailable: {e}, using in-memory fallback")
                self._client = chromadb.Client()
        return self._client

    @property
    def collection(self) -> chromadb.Collection:
        if self._collection is None:
            self._collection = self.client.get_or_create_collection(
                name="sbi_knowledge_base",
                metadata={"hnsw:space": "cosine"},
            )
        return self._collection

    def add_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict[str, Any]]] = None,
        ids: Optional[List[str]] = None,
    ) -> None:
        """Add documents to the vector store"""
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(documents))]

        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids,
        )
        logger.info(f"Added {len(documents)} documents to ChromaDB")

    def query(
        self,
        query_text: str,
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Query the vector store for relevant documents"""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results,
                where=where,
            )

            docs = []
            if results and results.get("documents"):
                for i, doc in enumerate(results["documents"][0]):
                    docs.append({
                        "content": doc,
                        "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
                        "distance": results["distances"][0][i] if results.get("distances") else 0,
                        "id": results["ids"][0][i] if results.get("ids") else "",
                    })
            return docs
        except Exception as e:
            logger.error(f"ChromaDB query error: {e}")
            return []

    def get_collection_count(self) -> int:
        """Get the number of documents in the collection"""
        try:
            return self.collection.count()
        except Exception:
            return 0

    def seed_banking_knowledge(self) -> None:
        """Seed the knowledge base with SBI banking product information"""
        try:
            if self.get_collection_count() > 0:
                logger.info("Knowledge base already seeded")
                return

            documents = BANKING_KNOWLEDGE
            metadatas = [{"category": doc["category"], "product": doc.get("product", "general")} for doc in documents]
            ids = [f"kb_{i}" for i in range(len(documents))]
            texts = [doc["content"] for doc in documents]

            self.add_documents(texts, metadatas, ids)
            logger.info(f"Seeded knowledge base with {len(documents)} documents")
        except Exception as e:
            logger.warning(f"Failed to seed ChromaDB vector store: {e}. RAG features may be offline or limited.")


# ─── Banking Knowledge Base ───
BANKING_KNOWLEDGE = [
    {
        "category": "savings",
        "product": "SBI Savings Account",
        "content": "SBI Savings Account offers competitive interest rates starting at 2.70% p.a. for balances up to ₹10 crore. "
        "Minimum balance requirement varies by branch type: Metro ₹3,000, Semi-Urban ₹2,000, Rural ₹1,000. "
        "Features include free debit card, internet banking, mobile banking, NEFT/RTGS, and UPI transactions. "
        "YONO digital account can be opened with zero minimum balance.",
    },
    {
        "category": "fixed_deposit",
        "product": "SBI Fixed Deposit",
        "content": "SBI Fixed Deposits offer interest rates ranging from 3.50% to 7.10% p.a. depending on tenure. "
        "Senior citizens get additional 0.50% on FDs. Tax Saver FD has 5-year lock-in with Section 80C benefits up to ₹1.5 lakh. "
        "Premature withdrawal allowed with 1% penalty. Loan against FD available up to 90% of deposit value.",
    },
    {
        "category": "loans",
        "product": "SBI Home Loan",
        "content": "SBI Home Loan offers interest rates starting at 8.50% p.a. (linked to RBI repo rate). "
        "Maximum tenure up to 30 years. Processing fee: 0.35% of loan amount. "
        "Pradhan Mantri Awas Yojana (PMAY) credit-linked subsidy available for first-time buyers. "
        "Pre-approved home loans available for existing salary account holders.",
    },
    {
        "category": "loans",
        "product": "SBI Personal Loan",
        "content": "SBI Xpress Credit personal loan for salaried individuals: up to ₹20 lakh at 11.0% p.a. onwards. "
        "No collateral required. Quick disbursement via YONO app. "
        "Tenure: 6 months to 6 years. Processing fee: 1% of loan amount (min ₹1,000).",
    },
    {
        "category": "investments",
        "product": "SBI Mutual Funds",
        "content": "SBI Mutual Fund offers 50+ schemes across equity, debt, and hybrid categories. "
        "SIP starting from ₹500/month. Top performers: SBI Bluechip Fund, SBI Small Cap Fund. "
        "Tax-saving ELSS funds with 3-year lock-in qualify for Section 80C deduction up to ₹1.5 lakh.",
    },
    {
        "category": "insurance",
        "product": "SBI Life Insurance",
        "content": "SBI Life Insurance offers term, endowment, ULIP, and pension plans. "
        "eShield term plan: ₹1 Cr cover for ₹500/month (30-year old, 30-year term). "
        "Premium payment via YONO with auto-debit facility. Tax benefits under Section 80C and 10(10D).",
    },
    {
        "category": "digital",
        "product": "YONO App",
        "content": "YONO (You Only Need One) is SBI's integrated digital banking platform. "
        "Features: account opening, fund transfers, bill payments, investments, loans, insurance. "
        "YONO Lite for basic banking. YONO Business for SME and corporate customers. "
        "Over 52 million registered users. Supports UPI, NEFT, RTGS, IMPS.",
    },
    {
        "category": "credit_card",
        "product": "SBI Credit Cards",
        "content": "SBI offers SimplyCLICK (online shopping), SimplyLIFE (lifestyle), BPCL (fuel), Air India (travel) credit cards. "
        "Reward points: 10 per ₹100 spent. Airport lounge access on premium cards. "
        "EMI conversion available at 12% p.a. for purchase above ₹2,500. "
        "Contactless payment enabled. Set spending limits via YONO.",
    },
    {
        "category": "nri",
        "product": "NRI Banking",
        "content": "SBI NRI services include NRE (repatriable), NRO (non-repatriable) savings and FD accounts. "
        "FCNR deposits in foreign currency. Remittance services via SBI Remit. "
        "Home loans for NRIs available. YONO Global app for international customers.",
    },
    {
        "category": "compliance",
        "product": "KYC and Compliance",
        "content": "KYC verification required for all accounts as per RBI guidelines. "
        "eKYC via Aadhaar-based authentication for instant verification. "
        "Video KYC available for remote onboarding. "
        "Periodic KYC update required every 2 years (high risk) to 10 years (low risk). "
        "Anti-money laundering (AML) monitoring on all transactions.",
    },
]


# Singleton instance
vector_store = VectorStore()
