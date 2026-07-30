export const validLimitNumber = (value: string, limit = 10000000) => {
  if (value === "" || value === ".") {
    return value;
  }
  const parsedValue = parseFloat(value);
  if (Number.isNaN(parsedValue)) return;
  if (parsedValue > limit) return;
  return value;
};
