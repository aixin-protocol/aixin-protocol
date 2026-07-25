"""SIP intent validation: JSON Schema + deterministic rule checks."""

from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import Any

from jsonschema import Draft202012Validator, ValidationError


@dataclass(frozen=True)
class ValidationResult:
    """Result of validating a SIP intent."""

    valid: bool
    kind: str | None
    errors: list[str]


def detect_kind(intent: Any) -> str | None:
    """Extract the SIP kind string from an intent, if present."""
    if isinstance(intent, dict):
        kind = intent.get("kind")
        if isinstance(kind, str):
            return kind
    return None


def _coerce_decimal(value: Any) -> Decimal | None:
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None


def _evaluate_rule(intent: dict, rule: dict) -> list[str]:
    """Evaluate a single deterministic rule and return error messages."""
    errors: list[str] = []
    path = rule.get("path", "")
    op = rule.get("op", "")
    expected = rule.get("value")

    if not path or not op:
        errors.append("Rule missing 'path' or 'op'")
        return errors

    # Navigate the dotted path
    parts = path.split(".")
    current: Any = intent
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            errors.append(f"Rule path not found: {path}")
            return errors

    if op == "eq":
        if current != expected:
            errors.append(f"{path} must equal {expected!r}, got {current!r}")
    elif op == "neq":
        if current == expected:
            errors.append(f"{path} must not equal {expected!r}")
    elif op == "gt":
        left, right = _coerce_decimal(current), _coerce_decimal(expected)
        if left is None or right is None or left <= right:
            errors.append(f"{path} must be > {expected}, got {current}")
    elif op == "gte":
        left, right = _coerce_decimal(current), _coerce_decimal(expected)
        if left is None or right is None or left < right:
            errors.append(f"{path} must be >= {expected}, got {current}")
    elif op == "lt":
        left, right = _coerce_decimal(current), _coerce_decimal(expected)
        if left is None or right is None or left >= right:
            errors.append(f"{path} must be < {expected}, got {current}")
    elif op == "lte":
        left, right = _coerce_decimal(current), _coerce_decimal(expected)
        if left is None or right is None or left > right:
            errors.append(f"{path} must be <= {expected}, got {current}")
    elif op == "in":
        if not isinstance(expected, list) or current not in expected:
            errors.append(f"{path} must be one of {expected}, got {current}")
    elif op == "not_in":
        if isinstance(expected, list) and current in expected:
            errors.append(f"{path} must not be one of {expected}, got {current}")
    else:
        errors.append(f"Unsupported rule op: {op}")

    return errors


def validate(
    intent: Any,
    schema: dict | None = None,
    rules: list[dict] | None = None,
) -> ValidationResult:
    """Validate a SIP intent against a JSON Schema and deterministic rules.

    Args:
        intent: The parsed intent payload (usually a dict).
        schema: Optional JSON Schema dict.
        rules: Optional list of deterministic rule dicts.

    Returns:
        A ``ValidationResult`` with ``valid``, ``kind``, and ``errors``.
    """
    errors: list[str] = []

    if not isinstance(intent, dict):
        return ValidationResult(valid=False, kind=None, errors=["Intent must be an object"])

    kind = detect_kind(intent)

    if schema is not None:
        validator = Draft202012Validator(schema)
        for error in validator.iter_errors(intent):
            errors.append(_format_schema_error(error))

    for rule in rules or []:
        errors.extend(_evaluate_rule(intent, rule))

    return ValidationResult(valid=len(errors) == 0, kind=kind, errors=errors)


def _format_schema_error(error: ValidationError) -> str:
    path = ".".join(str(p) for p in error.path) if error.path else "(root)"
    return f"{path}: {error.message}"
