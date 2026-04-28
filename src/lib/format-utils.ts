/**
 * A utility to format numbers consistently across locales.
 * It always uses Western Arabic numerals (English style) even in Arabic locale.
 */
export function formatNumber(
  value: number,
  options: {
    type?: "currency" | "number" | "percentage";
    precision?: number;
    showSign?: boolean;
  } = {}
) {
  const { type = "number", precision = 2, showSign = false } = options;
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  let result = formatter.format(value);
  
  if (showSign && value > 0) {
    result = `+${result}`;
  }
  
  return result;
}
