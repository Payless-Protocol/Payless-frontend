"use client";

export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

export const paymasterConfig = {
  paymasterService: {
    url: PAYMASTER_URL,
  },
};
