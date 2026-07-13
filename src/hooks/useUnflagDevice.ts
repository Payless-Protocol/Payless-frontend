"use client";

// Sanitized to clear old Eethers/window conflicts with Privy Smart Wallets
export function useUnflagDevice() {
  const unflag = async () => {};
  return { 
    unflag, 
    isLoading: false, 
    isSuccess: false, 
    error: null, 
    txHash: undefined 
  };
}
