export type DeviceRecord = {
  secretHash: `0x${string}`;
  updateAt: bigint;
  status: 0 | 1 | 2;
};
