"""Tests for SIP intent validation."""

import pytest

from aixin_protocol_sdk import ValidationResult, detect_kind, validate


def test_detect_kind():
    assert detect_kind({"kind": "sip:transfer:v1"}) == "sip:transfer:v1"
    assert detect_kind({}) is None
    assert detect_kind("not a dict") is None


def test_validate_basic():
    intent = {"kind": "sip:noop:v1"}
    result = validate(intent)
    assert isinstance(result, ValidationResult)
    assert result.valid is True
    assert result.kind == "sip:noop:v1"
    assert result.errors == []


def test_validate_schema_failure():
    schema = {
        "type": "object",
        "properties": {"kind": {"const": "sip:transfer:v1"}},
        "required": ["kind"],
    }
    result = validate({"kind": "sip:other:v1"}, schema=schema)
    assert result.valid is False
    assert any("kind" in e for e in result.errors)


def test_validate_rule_lte():
    intent = {"kind": "sip:transfer:v1", "params": {"amount": "100.00"}}
    rules = [{"path": "params.amount", "op": "lte", "value": "1000.00"}]
    assert validate(intent, rules=rules).valid is True


def test_validate_rule_lte_fails():
    intent = {"kind": "sip:transfer:v1", "params": {"amount": "2000.00"}}
    rules = [{"path": "params.amount", "op": "lte", "value": "1000.00"}]
    result = validate(intent, rules=rules)
    assert result.valid is False
    assert any("must be <=" in e for e in result.errors)


def test_validate_rule_path_missing():
    intent = {"kind": "sip:transfer:v1"}
    rules = [{"path": "params.amount", "op": "lte", "value": "1000.00"}]
    result = validate(intent, rules=rules)
    assert result.valid is False
    assert any("not found" in e for e in result.errors)
