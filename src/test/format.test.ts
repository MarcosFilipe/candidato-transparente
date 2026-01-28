import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyCompact, formatNumber } from '@/lib/format';

describe('formatCurrency', () => {
  it('should format currency in BRL', () => {
    // Note: Intl.NumberFormat uses non-breaking spaces which may differ
    expect(formatCurrency(1234.56)).toContain('1.234,56');
    expect(formatCurrency(0)).toContain('0,00');
    expect(formatCurrency(1000000)).toContain('1.000.000,00');
  });
});

describe('formatCurrencyCompact', () => {
  it('should format millions as M', () => {
    expect(formatCurrencyCompact(1500000)).toBe('R$ 1.5M');
    expect(formatCurrencyCompact(15000000)).toBe('R$ 15.0M');
  });

  it('should format thousands as K', () => {
    expect(formatCurrencyCompact(5000)).toBe('R$ 5.0K');
    expect(formatCurrencyCompact(150000)).toBe('R$ 150.0K');
  });

  it('should format small values normally', () => {
    expect(formatCurrencyCompact(500)).toContain('500,00');
  });
});

describe('formatNumber', () => {
  it('should format numbers with Brazilian locale', () => {
    expect(formatNumber(1234567)).toBe('1.234.567');
    expect(formatNumber(0)).toBe('0');
  });
});
