import { keccak256, encodePacked } from 'viem';

export const hashIMEI = (imei: string) => {
  return keccak256(encodePacked(['string'], [imei]));
};

export const hashSecret = (words: string[]) => {
  const combined = words.map(w => w.toLowerCase().trim()).join("");
  return keccak256(encodePacked(['string'], [combined]));
};

