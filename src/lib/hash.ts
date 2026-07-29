import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, bytesToHex } from "ethereum-cryptography/utils.js";

type Bytes32 = `0x${string}`;

function toBytes32(text: string): Bytes32 {
  const bytes = utf8ToBytes(text.trim());
  const digest = keccak256(bytes);
  return `0x${bytesToHex(digest)}` as Bytes32;
}

export function hashIMEI(imei: string): Bytes32 {
  return toBytes32(imei);
}

export function hashSecret(words: [string, string, string]): Bytes32 {
  const normalized = words.map((w) => w.trim().toLowerCase()).join(" ");
  return toBytes32(normalized);
}

export function validateIMEI(imei: string): boolean {
  // Must be exactly 15 digits, no spaces/dashes/special chars
  return /^\d{15}$/.test(imei.trim());
}

export function validateWord(word: string): boolean {
  // Words must be 2+ characters, letters only (no numbers/special chars)
  return /^[a-zA-Z]{2,}$/.test(word.trim());
}

export function buildHashedPayload(
  imei: string,
  words: [string, string, string]
) {
  return {
    imeiHash: hashIMEI(imei),
    secretHash: hashSecret(words),
  };
}

