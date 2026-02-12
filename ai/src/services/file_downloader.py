"""
File Downloader Service
Downloads files from Cloudinary URLs for processing.
"""
import httpx
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class FileDownloader:
    """Service for downloading files from URLs."""
    
    def __init__(self):
        self.temp_dir = Path("/tmp/veritalent_ai")
        self.temp_dir.mkdir(parents=True, exist_ok=True)
    
    async def download_from_url(
        self,
        url: str,
        original_filename: str,
    ) -> Optional[bytes]:
        """
        Download file from Cloudinary URL.
        
        Args:
            url: Cloudinary secure_url
            original_filename: Original filename for logging
            
        Returns:
            File content as bytes, or None if download fails
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"Downloading file from Cloudinary: {original_filename}")
                response = await client.get(url)
                response.raise_for_status()
                
                content = response.content
                logger.info(
                    f"Downloaded {len(content)} bytes for {original_filename}"
                )
                return content
                
        except httpx.HTTPError as e:
            logger.error(f"Failed to download from {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error downloading {original_filename}: {e}")
            return None
    
    async def download_multiple(
        self,
        files: list[dict[str, str]],
    ) -> list[tuple[str, bytes]]:
        """
        Download multiple files from URLs.
        
        Args:
            files: List of dicts with 'url' and 'original_name' keys
            
        Returns:
            List of tuples (filename, content)
        """
        results = []
        
        for file_info in files:
            url = file_info.get("url")
            filename = file_info.get("original_name", "unknown")
            
            if not url:
                logger.warning(f"No URL provided for {filename}")
                continue
            
            content = await self.download_from_url(url, filename)
            if content:
                results.append((filename, content))
        
        return results


# Singleton instance
file_downloader = FileDownloader()
