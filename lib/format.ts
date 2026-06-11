/** Format market cap (INR) as readable crore string: ₹19,500 Cr, ₹3.20L Cr, etc. */
export function formatMarketCap(value: number): string {
  if (!value || value <= 0) return '-';
  const crores = value / 1e7;
  if (crores >= 100000) {
    // ≥ 1 lakh crore → "₹X.XXL Cr"
    return `₹${(crores / 100000).toFixed(2)}L Cr`;
  }
  if (crores >= 1) {
    return `₹${Math.round(crores).toLocaleString('en-IN')} Cr`;
  }
  // < 1 Cr
  const lakhs = value / 1e5;
  return `₹${Math.round(lakhs).toLocaleString('en-IN')} L`;
}
