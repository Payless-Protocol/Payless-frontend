export const PAYLESS_ABI = [
  {
    inputs: [{ internalType: "bytes32", name: "imeiHash", type: "bytes32" }],
    name: "registry",
    outputs: [
      { internalType: "bool", name: "flagged", type: "bool" },
      { internalType: "address", name: "reporter", type: "address" },
      { internalType: "string", name: "notes", type: "string" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "imeiHash", type: "bytes32" },
      { internalType: "bytes32", name: "secretHash", type: "bytes32" },
    ],
    name: "flagDevice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "imeiHash", type: "bytes32" },
      { internalType: "bytes32", name: "secretHash", type: "bytes32" },
    ],
    name: "unflagDevice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "InvalidImei",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSecret",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyUnflagged",
    type: "error",
  },
] as const;
