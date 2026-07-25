"""Tests for Ed25519 receipt signing and verification."""

from aixin_protocol_sdk import canonicalize, hash_canonical, verify
from aixin_protocol_sdk.keys import generate_keypair, sign_receipt


def test_sign_and_verify_round_trip():
    private_key, public_key = generate_keypair()
    receipt = {
        "version": "sip:receipt:v1",
        "canonical_hash": hash_canonical({"decision": "approved"}),
        "decision": "approved",
        "timestamp": "2026-07-25T00:00:00Z",
    }
    signed = sign_receipt(receipt, private_key)
    assert "signature" in signed
    assert "public_key" in signed
    assert verify(signed, public_key) is True


def test_verify_rejects_tampered_payload():
    private_key, public_key = generate_keypair()
    receipt = {
        "version": "sip:receipt:v1",
        "canonical_hash": hash_canonical({"decision": "approved"}),
        "decision": "approved",
        "timestamp": "2026-07-25T00:00:00Z",
    }
    signed = sign_receipt(receipt, private_key)
    signed["decision"] = "rejected"
    assert verify(signed, public_key) is False


def test_verify_rejects_wrong_public_key():
    private_key, _ = generate_keypair()
    _, other_public_key = generate_keypair()
    receipt = {
        "version": "sip:receipt:v1",
        "canonical_hash": hash_canonical({"decision": "approved"}),
        "decision": "approved",
        "timestamp": "2026-07-25T00:00:00Z",
    }
    signed = sign_receipt(receipt, private_key)
    assert verify(signed, other_public_key) is False


def test_canonicalization_interop_with_js_shape():
    """Ensure the signing payload canonicalization matches the JS SDK compact form."""
    payload = {"b": 2, "a": {"z": 1, "y": 2}}
    canonical = canonicalize(payload)
    assert canonical == {"a": {"y": 2, "z": 1}, "b": 2}
