# Custom Exceptions for Landing Page Manager

class LandingPageError(Exception):
    """Base exception for landing page operations"""
    pass


class HomepageError(Exception):
    """Base exception for homepage operations"""
    pass


class ValidationError(LandingPageError):
    """Raised when validation fails"""
    pass


class FileUploadError(LandingPageError):
    """Raised when file upload fails"""
    pass


class ZipProcessingError(FileUploadError):
    """Raised when ZIP file processing fails"""
    pass


class SubdomainError(ValidationError):
    """Raised when subdomain validation fails"""
    pass


class HomepageNotFoundError(HomepageError):
    """Raised when homepage is not found"""
    pass


class HomepageActivationError(HomepageError):
    """Raised when homepage activation fails"""
    pass


class TrackingError(LandingPageError):
    """Raised when tracking code injection fails"""
    pass


class DatabaseError(LandingPageError):
    """Raised when database operations fail"""
    pass


class AuthenticationError(Exception):
    """Raised when authentication fails"""
    pass


class PermissionError(Exception):
    """Raised when user lacks required permissions"""
    pass