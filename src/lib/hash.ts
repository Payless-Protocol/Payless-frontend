import { keccak256, toUtf8Bytes } from "ethers";

export function hashIMEI(imei: string): `0x${string}` {
  return keccak256(toUtf8Bytes(imei.trim())) as `0x${string}`;
}

export function hashSecret(words: string[]): `0x${string}` {
  const joined = words.map((word) => word.trim().toLowerCase()).join("-");
  return keccak256(toUtf8Bytes(joined)) as `0x${string}`;
}
