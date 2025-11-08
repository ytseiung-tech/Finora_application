export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  // If amount is >= 10000, use k format
  if (absAmount >= 10000) {
    const thousands = absAmount / 1000;
    const formatted = thousands >= 100 
      ? Math.round(thousands).toString() 
      : thousands.toFixed(1);
    return `${sign}$${formatted}k`;
  }
  
  // Otherwise use regular format
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

/**
 * Format numbers with compact notation (k, M, B)
 * @param num - The number to format
 * @returns Formatted string (e.g., "100k", "1.5M", "3.5B")
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

/**
 * Format numbers with compact notation using Intl.NumberFormat
 * Supports locale-based formatting (e.g., "1.5M" in English, "150萬" in Chinese)
 * @param num - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted string
 */
export const formatCompact = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

