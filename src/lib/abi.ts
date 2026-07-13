export const PAYLESS_ABI = [
  {
    inputs: [],
    name: "AlreadyUnflagged",
    type: "error",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "imeiHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "Tier1",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "imeiHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "UnflagTier1",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "imeiHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "flagDevice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "imeiHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "unflagDevice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "registry",
    outputs: [
      {
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "updateAt",
        type: "uint64",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
