export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format large amounts with k (thousand) or M (million) suffix
 * @param amount - The amount to format
 * @param threshold - The threshold to start using suffixes (default: 100000)
 * @returns Formatted string (e.g., "150k", "1.5M", "99999")
 */
export const formatAmount = (amount: number, threshold: number = 100000): string => {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 1000000) {
    // Format as millions (M)
    const millions = absAmount / 1000000;
    return `${sign}${millions.toFixed(millions >= 10 ? 1 : 2)}M`;
  } else if (absAmount >= threshold) {
    // Format as thousands (k)
    const thousands = absAmount / 1000;
    return `${sign}${thousands.toFixed(thousands >= 100 ? 0 : 1)}k`;
  } else {
    // Return as-is for amounts below threshold
    return `${sign}${absAmount.toLocaleString('zh-TW')}`;
  }
};

/**
 * Format currency with NT$ prefix and k/M suffix for large amounts
 * @param amount - The amount to format
 * @param threshold - The threshold to start using suffixes (default: 100000)
 * @returns Formatted currency string (e.g., "NT$ 150k", "NT$ 1.5M")
 */
export const formatCurrencyCompact = (amount: number, threshold: number = 100000): string => {
  return `NT$ ${formatAmount(amount, threshold)}`;
};

