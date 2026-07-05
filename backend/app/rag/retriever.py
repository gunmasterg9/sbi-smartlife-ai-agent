"""
RAG Retriever — Context retrieval for agent responses
"""
from typing import List, Dict, Any
from app.rag.vector_store import vector_store
import logging

logger = logging.getLogger("sbi_rag")


class Retriever:
    """Retrieves relevant banking context from ChromaDB for agent responses"""

    def __init__(self, n_results: int = 3):
        self.n_results = n_results

    def get_context(
        self,
        query: str,
        category: str = None,
    ) -> str:
        """Retrieve relevant context as a formatted string for agent prompts"""
        where_filter = {"category": category} if category else None

        results = vector_store.query(
            query_text=query,
            n_results=self.n_results,
            where=where_filter,
        )

        if not results:
            return ""

        context_parts = []
        for doc in results:
            product = doc.get("metadata", {}).get("product", "General")
            context_parts.append(f"**{product}:** {doc['content']}")

        return "\n\n".join(context_parts)

    def get_product_info(self, product_name: str) -> str:
        """Retrieve specific product information"""
        return self.get_context(product_name, category=None)

    def get_contextual_suggestions(
        self, query: str
    ) -> List[Dict[str, Any]]:
        """Get suggested products based on query context"""
        results = vector_store.query(query_text=query, n_results=3)
        suggestions = []
        for doc in results:
            meta = doc.get("metadata", {})
            suggestions.append({
                "product": meta.get("product", "General"),
                "category": meta.get("category", "general"),
                "relevance": 1 - doc.get("distance", 0),
            })
        return suggestions


# Singleton
retriever = Retriever()
