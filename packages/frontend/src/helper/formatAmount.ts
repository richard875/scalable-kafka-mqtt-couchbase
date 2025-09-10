const formatAmount = (value: number | string): string => {
  if (!value || value === "") return "";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";
  return numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default formatAmount;
