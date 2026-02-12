"""
Embedding Service

Service for generating and managing text embeddings using Azure AI.
"""
from typing import Any

from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential

from src.config import settings
from src.services.cosmos_service import CosmosVectorService


class EmbeddingService:
    """Service for text embeddings using Azure AI and Cosmos DB."""

    def __init__(self):
        # Azure AI Embeddings Client
        self.client = EmbeddingsClient(
            endpoint=settings.azure_ai_endpoint.replace("/chat/completions", "/embeddings"),
            credential=AzureKeyCredential(settings.azure_ai_api_key),
        )
        self.model = settings.azure_embedding_model
        
        # Cosmos DB Vector Storage
        self.vector_db = CosmosVectorService()

    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generate embedding for a text.
        
        Args:
            text: Text to embed
            
        Returns:
            List of floats representing the embedding
        """
        try:
            response = self.client.embed(
                input=[text],
                model=self.model,
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            print(f"Embedding generation error: {e}")
            return []

    async def generate_batch_embeddings(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        """
        Generate embeddings for multiple texts.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embeddings
        """
        try:
            response = self.client.embed(
                input=texts,
                model=self.model,
            )
            
            return [item.embedding for item in response.data]
            
        except Exception as e:
            print(f"Batch embedding error: {e}")
            return [[] for _ in texts]

    async def store_embedding(
        self,
        doc_id: str,
        embedding: list[float],
        metadata: dict[str, Any] | None = None,
        text: str = "",
    ) -> bool:
        """
        Store an embedding in Cosmos DB.
        
        Args:
            doc_id: Unique identifier
            embedding: The embedding vector
            metadata: Optional metadata
            text: Original text
            
        Returns:
            Success status
        """
        try:
            self.vector_db.store_embedding(
                doc_id=doc_id,
                embedding=embedding,
                metadata=metadata or {},
                text=text,
            )
            return True
        except Exception as e:
            print(f"Error storing embedding: {e}")
            return False

    async def search_similar(
        self,
        embedding: list[float],
        limit: int = 10,
        filter_metadata: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Search for similar embeddings.
        
        Args:
            embedding: Query embedding
            limit: Maximum results
            filter: Optional filter conditions
            
        Returns:
            List of similar items with scores
        """
        # TODO: Implement vector database search
        return []

    async def get_skill_similarity(
        self,
        skill1: str,
        skill2: str,
    ) -> float:
        """
        Calculate similarity between two skills.
        
        Args:
            skill1: First skill
            skill2: Second skill
            
        Returns:
            Similarity score 0-1
        """
        emb1 = await self.generate_embedding(skill1)
        emb2 = await self.generate_embedding(skill2)
        
        if not emb1 or not emb2:
            return 0.0
        
        # Cosine similarity
        dot_product = sum(a * b for a, b in zip(emb1, emb2))
        norm1 = sum(a * a for a in emb1) ** 0.5
        norm2 = sum(b * b for b in emb2) ** 0.5
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
