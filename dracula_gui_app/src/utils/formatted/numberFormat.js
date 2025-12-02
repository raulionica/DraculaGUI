export function formatNumber(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value);
}

export function toNumber(value) {
  return value == null || value === "" ? null : Number(String(value).replace(/\./g, ""));
}