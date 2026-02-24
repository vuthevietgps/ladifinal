# Utility Functions for Landing Page Manager
import re
from typing import Optional

ANALYTICS_BLOCK_RE = re.compile(
    r'<!--\s*Analytics\s*&\s*Tracking\s*-->.*?<!--\s*/Analytics\s*&\s*Tracking\s*-->\s*',
    re.IGNORECASE | re.DOTALL
)
CUSTOM_TRACKING_BLOCK_RE = re.compile(
    r'<!--\s*Custom\s*Tracking\s*Events\s*-->.*?<!--\s*/Custom\s*Tracking\s*Events\s*-->\s*',
    re.IGNORECASE | re.DOTALL
)


def sanitize_subdomain(subdomain: str) -> Optional[str]:
    """
    Sanitize and validate subdomain string.
    
    Rules:
    - Only lowercase letters, numbers, and hyphens
    - Must start and end with alphanumeric
    - Length between 1 and 40 characters
    - No consecutive hyphens
    - Not reserved words
    """
    if not subdomain:
        return None
    
    # Convert to lowercase and strip whitespace
    subdomain = subdomain.lower().strip()
    
    # Remove invalid characters (keep only a-z, 0-9, -)
    subdomain = re.sub(r'[^a-z0-9-]', '', subdomain)
    
    # Remove consecutive hyphens
    subdomain = re.sub(r'-+', '-', subdomain)
    
    # Remove leading/trailing hyphens
    subdomain = subdomain.strip('-')
    
    # Validate length
    if len(subdomain) < 1 or len(subdomain) > 40:
        return None
    
    # Validate pattern (alphanumeric start/end)
    if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', subdomain):
        return None
    
    # Check reserved words
    from .constants import SUBDOMAIN_RESERVED_WORDS
    if subdomain in SUBDOMAIN_RESERVED_WORDS:
        return None
    
    return subdomain


def inject_tracking(html_content: str, head_snippet: str = "", body_snippet: str = "") -> str:
    """
    Inject tracking codes into HTML content.
    
    Args:
        html_content: Original HTML content
        head_snippet: Code to inject before </head>
        body_snippet: Code to inject before </body>
    
    Returns:
        Modified HTML content with tracking codes injected
    """
    if not html_content:
        return html_content
    
    modified_content = ANALYTICS_BLOCK_RE.sub('', html_content)
    modified_content = CUSTOM_TRACKING_BLOCK_RE.sub('', modified_content)

    # Inject head snippet before </head> (case-insensitive)
    if head_snippet and head_snippet.strip():
        head_pattern = re.compile(r'</head\s*>', re.IGNORECASE)
        if head_pattern.search(modified_content):
            modified_content = head_pattern.sub(
                f'{head_snippet.strip()}\n</head>',
                modified_content,
                count=1
            )
        else:
            modified_content = f'{head_snippet.strip()}\n{modified_content}'

    # Inject body snippet before </body> (case-insensitive)
    if body_snippet and body_snippet.strip():
        body_pattern = re.compile(r'</body\s*>', re.IGNORECASE)
        if body_pattern.search(modified_content):
            modified_content = body_pattern.sub(
                f'{body_snippet.strip()}\n</body>',
                modified_content,
                count=1
            )
        else:
            modified_content = f'{modified_content}\n{body_snippet.strip()}'

    return modified_content
