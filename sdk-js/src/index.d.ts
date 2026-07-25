// Type definitions for @aixin-protocol/sdk-js

export type Kind =
  | "intent"
  | "sip-report"
  | "outcome-contract"
  | "bounded-loop"
  | "manifest";

export interface ValidationError {
  instancePath?: string;
  message?: string;
  params?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationError[];
}

export interface Validator {
  validate(kind: Kind, doc: unknown): ValidationResult;
  detectKind(doc: unknown): Kind | null;
}

export interface CreateValidatorOptions {
  /** Map of "<name>.schema.json" -> parsed JSON schema. Overrides bundled set. */
  schemas?: Record<string, unknown>;
}

export function createValidator(opts?: CreateValidatorOptions): Validator;
export function validate(kind: Kind, doc: unknown): ValidationResult;
export function detectKind(doc: unknown): Kind | null;

export function canonicalize(value: unknown): string;
export function hashCanonical(value: unknown): string;

export interface Receipt {
  payload: unknown;
  signature: string;      // hex
  public_key?: string;    // PEM
  [k: string]: unknown;
}

export interface VerifyOptions {
  /** Override public key (PEM). Falls back to receipt.public_key. */
  publicKey?: string;
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

export function verifyReceipt(receipt: Receipt, opts?: VerifyOptions): VerifyResult;

export const VERSION: string;
