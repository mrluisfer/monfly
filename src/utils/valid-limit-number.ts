export const validLimitNumber = (value: string, limit = 10_000_000) => {
  if (value === "" || value === ".") {
    return value;
  }
  const parsedValue = Number.parseFloat(value);
  if (Number.isNaN(parsedValue)) {
    return;
  }
  if (parsedValue > limit) {
    return;
  }
  return value;
};
