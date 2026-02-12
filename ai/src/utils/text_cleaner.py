"""
Text Cleaner

Utilities for cleaning and normalizing text.
"""
import re
from typing import Optional


def clean_text(text: str) -> str:
    """
    Clean and normalize text.
    
    Args:
        text: Raw text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)
    
    # Remove control characters
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", text)
    
    # Normalize quotes
    text = text.replace(""", '"').replace(""", '"')
    text = text.replace("'", "'").replace("'", "'")
    
    # Normalize dashes
    text = text.replace("–", "-").replace("—", "-")
    
    return text.strip()


def remove_emails(text: str) -> str:
    """Remove email addresses from text."""
    return re.sub(r"\S+@\S+\.\S+", "[EMAIL]", text)


def remove_phone_numbers(text: str) -> str:
    """Remove phone numbers from text."""
    # Various phone number patterns
    patterns = [
        r"\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}",
        r"\(\d{3}\)\s*\d{3}[-.\s]?\d{4}",
    ]
    
    for pattern in patterns:
        text = re.sub(pattern, "[PHONE]", text)
    
    return text


def remove_urls(text: str) -> str:
    """Remove URLs from text."""
    return re.sub(r"https?://\S+", "[URL]", text)


def extract_email(text: str) -> Optional[str]:
    """Extract first email address from text."""
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    """Extract first phone number from text."""
    patterns = [
        r"\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def extract_linkedin(text: str) -> Optional[str]:
    """Extract LinkedIn URL from text."""
    match = re.search(r"linkedin\.com/in/[\w-]+", text, re.IGNORECASE)
    return f"https://{match.group(0)}" if match else None


def extract_github(text: str) -> Optional[str]:
    """Extract GitHub URL from text."""
    match = re.search(r"github\.com/[\w-]+", text, re.IGNORECASE)
    return f"https://{match.group(0)}" if match else None


def truncate_text(text: str, max_length: int = 4000) -> str:
    """
    Truncate text to maximum length.
    
    Args:
        text: Input text
        max_length: Maximum character length
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    
    # Try to truncate at sentence boundary
    truncated = text[:max_length]
    last_period = truncated.rfind(".")
    
    if last_period > max_length * 0.8:
        return truncated[:last_period + 1]
    
    return truncated + "..."


def count_words(text: str) -> int:
    """Count words in text."""
    return len(text.split())


def estimate_tokens(text: str) -> int:
    """
    Estimate token count for text.
    
    Rough estimate: ~4 characters per token for English.
    """
    return len(text) // 4
