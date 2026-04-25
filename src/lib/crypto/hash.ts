import { keccak256, toUtf8Bytes } from "ethers";

const normalizeImei = (imei: string) => imei.trim().replace(/[^\d]/g, "");
const normalizeSecret = (secret: string) => secret.trim();

export function hashIMEI(imei: string) {
  const normalized = normalizeImei(imei);
  return keccak256(toUtf8Bytes(normalized));
}

export function hashSecret(secret: string) {
  const normalized = normalizeSecret(secret);
  return keccak256(toUtf8Bytes(normalized));
}

export function isValidImei(imei: string) {
  const normalized = normalizeImei(imei);
  return normalized.length >= 8 && normalized.length <= 32;
}
