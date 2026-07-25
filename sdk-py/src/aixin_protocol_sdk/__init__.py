"""AiXin Signal Intent Protocol (SIP) Python SDK."""

from .canonicalize import canonicalize, hash_canonical
from .keys import generate_keypair, sign_receipt
from .validate import ValidationResult, detect_kind, validate
from .verify import verify

__all__ = [
    "canonicalize",
    "detect_kind",
    "generate_keypair",
    "hash_canonical",
    "sign_receipt",
    "validate",
    "ValidationResult",
    "verify",
]

__version__ = "1.0.0-rc.1"
