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

export function buildHashedPayload(
  imei: string,
  words: [string, string, string]
) {
  return {
    imeiHash: hashIMEI(imei),
    secretHash: hashSecret(words),
  };
}

