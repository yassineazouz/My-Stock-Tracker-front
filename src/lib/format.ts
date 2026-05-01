export function safeNumber(value: number | null | undefined) {
  return Number.isFinite(value) ? Number(value) : 0;
}

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

export function formatCompact(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safeNumber(value));
}

export function formatPercent(value: number | null | undefined) {
  return `${safeNumber(value).toFixed(2)}%`;
}
