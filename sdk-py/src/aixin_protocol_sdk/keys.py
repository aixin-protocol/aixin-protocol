"""Ed25519 key generation and receipt signing helpers."""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

from .canonicalize import dumps_canonical


def _to_hex(data: bytes) -> str:
    return data.hex()


def _from_hex(value: str | bytes) -> bytes:
    if isinstance(value, bytes):
        return value
    return bytes.fromhex(value)


def generate_keypair() -> tuple[str, str]:
    """Generate a new Ed25519 keypair and return (private_key_hex, public_key_hex)."""
    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    return (
        _to_hex(private_key.private_bytes_raw()),
        _to_hex(public_key.public_bytes_raw()),
    )


def sign_receipt(receipt: dict, private_key_hex: str) -> dict:
    """Sign a receipt dict and return a new dict with signature + public key.

    The signature covers the canonical JSON of the receipt *without* any
    existing ``signature`` or ``public_key`` fields, matching the JS SDK behavior.
    """
    private_key = Ed25519PrivateKey.from_private_bytes(_from_hex(private_key_hex))
    public_key = private_key.public_key()

    signing_payload = {k: v for k, v in receipt.items() if k not in ("signature", "public_key")}
    canonical_bytes = dumps_canonical(signing_payload).encode("utf-8")
    signature = private_key.sign(canonical_bytes)

    return {
        **receipt,
        "signature": _to_hex(signature),
        "public_key": _to_hex(public_key.public_bytes_raw()),
    }
