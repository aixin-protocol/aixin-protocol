"""Tests for deterministic canonicalization and hashing."""

import json

import pytest

from aixin_protocol_sdk import canonicalize, hash_canonical


@pytest.mark.parametrize(
    ("input_obj", "expected"),
    [
        ({"b": 1, "a": 2}, {"a": 2, "b": 1}),
        (
            {"z": {"b": 2, "a": 1}, "y": 3},
            {"y": 3, "z": {"a": 1, "b": 2}},
        ),
        ([{"b": 1, "a": 2}], [{"a": 2, "b": 1}]),
        ("plain string", "plain string"),
        (123, 123),
        ({}, {}),
    ],
)
def test_canonicalize_sorts_keys(input_obj, expected):
    assert canonicalize(input_obj) == expected


def test_canonicalize_produces_compact_json():
    obj = {"b": 2, "a": {"z": 1, "y": 2}}
    compact = json.dumps(canonicalize(obj), separators=(",", ":"), ensure_ascii=False)
    assert compact == '{"a":{"y":2,"z":1},"b":2}'


def test_hash_canonical_is_stable():
    a = {"b": 2, "a": {"z": 1, "y": 2}}
    b = {"a": {"y": 2, "z": 1}, "b": 2}
    assert hash_canonical(a) == hash_canonical(b)
    assert len(hash_canonical(a)) == 64


def test_hash_matches_known_vector():
    """Cross-language sanity vector: same object in JS/TS and Python must hash identically."""
    obj = {"kind": "sip:transfer:v1", "params": {"amount": "100.00", "recipient": "0xabc"}}
    assert hash_canonical(obj) == "f17095a1d456351daa850e3fd4e1fa7468ef5958248d29b720df895cbb7016b8"
