export const toHexString = ({
  value,
  size,
}: {
  value: bigint | number;
  size: number;
}): string => {
  return value.toString(16).padStart(size * 2, '0');
};
