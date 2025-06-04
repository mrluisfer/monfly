export const validLimitNumber = (value: string, limit = 1000000) => {
  if (value === "" || value === ".") {
    return value;
  }
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) return;
  if (parsedValue > limit) return;
  return value;
};
