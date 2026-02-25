"""
MongoDB Vector Service

Service for storing and searching vector embeddings in MongoDB Atlas
"""
from typing import Any
import logging

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from src.config import settings

logger = logging.getLogger(__name__)


class MongoDBVectorService:
    """Service for vector storage and similarity search in MongoDB."""

    def __init__(self):
        # Make MongoDB optional for local development
        self.enabled = bool(settings.mongodb_connection_string)
        
        if not self.enabled:
            logger.warning("MongoDB disabled - no connection string")
            self.client = None
            self.db = None
            self.collection = None
            return
        
        try:
            # MongoDB Atlas connection with enhanced TLS/SSL configuration
            # Using mongodb+srv:// which handles TLS automatically
            # Increased timeouts for better reliability with Atlas
            self.client: MongoClient = MongoClient(
                settings.mongodb_connection_string,
                serverSelectionTimeoutMS=30000,  # 30s (increased from 5s)
                connectTimeoutMS=30000,  # 30s for initial connection
                socketTimeoutMS=30000,  # 30s for socket operations
                retryWrites=True,  # Automatic retry for transient failures
                w='majority',  # Write concern for durability
            )
            self.db: Database = self.client[settings.mongodb_database_name]
            self.collection: Collection = self.db[settings.mongodb_vectors_collection]
            
            # Test connection
            self.client.admin.command('ping')
            logger.info("✓ MongoDB Atlas connected successfully")
            
            # Create vector index if it doesn't exist
            self._ensure_vector_index()
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Running without vector storage.")
            self.enabled = False
            self.client = None
            self.db = None
            self.collection = None

    def _ensure_vector_index(self) -> None:
        """Create vector search index on embeddings field."""
        if not self.enabled:
            return
            
        try:
            # Check if index exists
            indexes = list(self.collection.list_indexes())
            vector_index_exists = any(
                idx.get("name") == "vector_index" for idx in indexes
            )
            
            if not vector_index_exists:
                # Create standard index for MongoDB Atlas
                # MongoDB Atlas supports vector indexes via Atlas Search
                self.collection.create_index(
                    [("embedding", 1)],
                    name="vector_index",
                )
                logger.info("Vector index created successfully")
        except Exception as e:
            logger.warning(f"Vector index creation skipped or failed: {e}")

    def store_embedding(
        self,
        doc_id: str,
        embedding: list[float],
        metadata: dict[str, Any],
        text: str = "",
    ) -> str:
        """
        Store an embedding vector with metadata.
        
        Args:
            doc_id: Unique document identifier
            embedding: Vector embedding (list of floats)
            metadata: Additional metadata to store
            text: Original text (optional)
            
        Returns:
            Document ID
        """
        if not self.enabled:
            logger.debug("MongoDB disabled, skipping embedding storage")
            return doc_id
            
        document = {
            "_id": doc_id,
            "embedding": embedding,
            "metadata": metadata,
            "text": text,
        }
        
        # Upsert the document
        self.collection.replace_one(
            {"_id": doc_id},
            document,
            upsert=True,
        )
        
        return doc_id

    def search_similar(
        self,
        query_embedding: list[float],
        limit: int = 10,
        filter_metadata: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Search for similar vectors using cosine similarity.
        
        Args:
            query_embedding: Query vector
            limit: Maximum number of results
            filter_metadata: Optional metadata filters
            
        Returns:
            List of similar documents with scores
        """
        if not self.enabled:
            logger.debug("MongoDB disabled, returning empty search results")
            return []
        
        # Use manual cosine similarity for MongoDB Atlas
        # For production, configure MongoDB Atlas Vector Search
        return self._manual_similarity_search(
            query_embedding, limit, filter_metadata
        )

    def _manual_similarity_search(
        self,
        query_embedding: list[float],
        limit: int,
        filter_metadata: dict[str, Any] | None,
    ) -> list[dict[str, Any]]:
        """
        Fallback: Manual cosine similarity calculation.
        
        This is slower but works without vector search index.
        """
        # Build match filter
        match_filter: dict[str, Any] = {}
        if filter_metadata:
            match_filter["metadata"] = filter_metadata
        
        # Fetch all documents (or filtered subset)
        documents = list(self.collection.find(match_filter))
        
        # Calculate cosine similarity for each
        results = []
        for doc in documents:
            if "embedding" in doc:
                similarity = self._cosine_similarity(
                    query_embedding, doc["embedding"]
                )
                results.append({
                    "_id": doc["_id"],
                    "metadata": doc.get("metadata", {}),
                    "text": doc.get("text", ""),
                    "score": similarity,
                })
        
        # Sort by similarity score (descending)
        results.sort(key=lambda x: x["score"], reverse=True)
        
        return results[:limit]

    def _cosine_similarity(self, vec1: list[float], vec2: list[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(a * a for a in vec1) ** 0.5
        magnitude2 = sum(b * b for b in vec2) ** 0.5
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)

    def delete_embedding(self, doc_id: str) -> bool:
        """
        Delete an embedding by ID.
        
        Args:
            doc_id: Document identifier
            
        Returns:
            True if deleted, False otherwise
        """
        result = self.collection.delete_one({"_id": doc_id})
        return result.deleted_count > 0

    def get_embedding(self, doc_id: str) -> dict[str, Any] | None:
        """
        Retrieve an embedding by ID.
        
        Args:
            doc_id: Document identifier
            
        Returns:
            Document or None if not found
        """
        return self.collection.find_one({"_id": doc_id})
