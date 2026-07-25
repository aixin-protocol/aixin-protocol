"""Deterministic canonicalization shared with @aixin-protocol/sdk-js."""

import hashlib
import json
from typing import Any


def canonicalize(obj: Any) -> Any:
    """Return a deep copy with dict keys sorted recursively.

    Lists are preserved in order; primitive values are returned as-is.
    The result is safe to serialize with ``json.dumps(..., separators=(",", ":"))``
    to produce byte-for-byte matching canonical JSON across languages.
    """
    if isinstance(obj, dict):
        return {k: canonicalize(v) for k, v in sorted(obj.items())}
    if isinstance(obj, list):
        return [canonicalize(item) for item in obj]
    return obj


def dumps_canonical(obj: Any) -> str:
    """Serialize an object to compact, deterministic JSON."""
    return json.dumps(
        canonicalize(obj),
        separators=(",", ":"),
        ensure_ascii=False,
        allow_nan=False,
    )


def hash_canonical(obj: Any) -> str:
    """Return the hex SHA-256 digest of the canonical JSON bytes."""
    canonical_bytes = dumps_canonical(obj).encode("utf-8")
    return hashlib.sha256(canonical_bytes).hexdigest()
