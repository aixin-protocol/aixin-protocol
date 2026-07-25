"""Ed25519 receipt signature verification."""

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

from .canonicalize import dumps_canonical


def _from_hex(value: str | bytes) -> bytes:
    if isinstance(value, bytes):
        return value
    return bytes.fromhex(value)


def verify(receipt: dict, public_key: str | bytes) -> bool:
    """Verify the Ed25519 signature on a receipt.

    The receipt must contain:
    - ``signature``: hex string or bytes
    - all other fields used as the signed payload (``signature`` and ``public_key``
      are stripped before canonicalization).

    Args:
        receipt: The signed receipt dict.
        public_key: Ed25519 public key as hex string or 32 raw bytes.

    Returns:
        True if the signature is valid, False otherwise.
    """
    signature_hex = receipt.get("signature")
    if not signature_hex:
        return False

    try:
        public_key_bytes = _from_hex(public_key)
        signature_bytes = _from_hex(signature_hex)
        ed25519_public_key = Ed25519PublicKey.from_public_bytes(public_key_bytes)

        signing_payload = {
            k: v for k, v in receipt.items() if k not in ("signature", "public_key")
        }
        canonical_bytes = dumps_canonical(signing_payload).encode("utf-8")

        ed25519_public_key.verify(signature_bytes, canonical_bytes)
        return True
    except (ValueError, InvalidSignature):
        return False
