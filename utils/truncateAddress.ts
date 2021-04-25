export function truncateAddress(address: string): string {
  if (address.length < 42) {
    throw new Error(`${address} is not  a valid address`);
  }
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
