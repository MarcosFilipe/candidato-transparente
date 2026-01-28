import { describe, it, expect } from 'vitest';
import { 
  parseMonetaryValue, 
  isTseNull, 
  isTseNotRegistered, 
  cleanTseString,
  makeCompositeKey,
  normalizeText
} from '@/data/parse';

describe('parseMonetaryValue', () => {
  it('should parse value with comma decimal separator', () => {
    expect(parseMonetaryValue('1234,56')).toBe(1234.56);
    expect(parseMonetaryValue('"850000,00"')).toBe(850000);
  });

  it('should parse value with dot decimal separator', () => {
    expect(parseMonetaryValue('1234.56')).toBe(1234.56);
  });

  it('should return null for #NULO', () => {
    expect(parseMonetaryValue('#NULO')).toBe(null);
    expect(parseMonetaryValue('"#NULO"')).toBe(null);
  });

  it('should return null for -1', () => {
    expect(parseMonetaryValue('-1')).toBe(null);
    expect(parseMonetaryValue('"-1"')).toBe(null);
  });

  it('should return null for #NE', () => {
    expect(parseMonetaryValue('#NE')).toBe(null);
  });

  it('should return null for -3', () => {
    expect(parseMonetaryValue('-3')).toBe(null);
  });

  it('should return null for empty string', () => {
    expect(parseMonetaryValue('')).toBe(null);
  });

  it('should handle large values', () => {
    expect(parseMonetaryValue('15000000,00')).toBe(15000000);
  });
});

describe('isTseNull', () => {
  it('should detect #NULO as null', () => {
    expect(isTseNull('#NULO')).toBe(true);
    expect(isTseNull('#NULO#')).toBe(true);
    expect(isTseNull('-1')).toBe(true);
  });

  it('should not detect valid values as null', () => {
    expect(isTseNull('test')).toBe(false);
    expect(isTseNull('0')).toBe(false);
  });
});

describe('isTseNotRegistered', () => {
  it('should detect #NE as not registered', () => {
    expect(isTseNotRegistered('#NE')).toBe(true);
    expect(isTseNotRegistered('#NE#')).toBe(true);
    expect(isTseNotRegistered('-3')).toBe(true);
  });

  it('should not detect valid values as not registered', () => {
    expect(isTseNotRegistered('test')).toBe(false);
    expect(isTseNotRegistered('-1')).toBe(false);
  });
});

describe('cleanTseString', () => {
  it('should trim and remove quotes', () => {
    expect(cleanTseString('"test"')).toBe('test');
    expect(cleanTseString('  test  ')).toBe('test');
  });

  it('should return empty for #NULO', () => {
    expect(cleanTseString('#NULO')).toBe('');
  });

  it('should return empty for #NE', () => {
    expect(cleanTseString('#NE')).toBe('');
  });
});

describe('makeCompositeKey', () => {
  it('should create correct composite key', () => {
    expect(makeCompositeKey(2024, 'SP', '71072', '000001')).toBe('2024|SP|71072|000001');
    expect(makeCompositeKey('2024', 'RJ', '58017', '000002')).toBe('2024|RJ|58017|000002');
  });
});

describe('normalizeText', () => {
  it('should lowercase and remove accents', () => {
    expect(normalizeText('São Paulo')).toBe('sao paulo');
    expect(normalizeText('JOSÉ')).toBe('jose');
    expect(normalizeText('Coração')).toBe('coracao');
  });

  it('should trim whitespace', () => {
    expect(normalizeText('  test  ')).toBe('test');
  });
});
