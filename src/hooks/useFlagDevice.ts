"use client";

// Sanitized to clear old Eethers/window conflicts with Privy Smart Wallets
export function useFlagDevice() {
  const flag = async () => {};
  return { 
    flag, 
    isLoading: false, 
    isSuccess: false, 
    error: null, 
    txHash: undefined 
  };
}
