import { useMemo } from "react";
import { buildHashedPayload } from "@/lib/hash";

export function useHashedPayload(
  imei: string,
  words: [string, string, string]
) {
  return useMemo(
    () => buildHashedPayload(imei, words),
    [imei, words]
  );
}
