// @jest-environment node
import { isPasswordStrong } from '../auth';
import { describe, it, expect } from '@jest/globals';

describe('isPasswordStrong', () => {
  it('should return true for strong passwords', () => {
    expect(isPasswordStrong('Abcdef1!')).toBe(true);
    expect(isPasswordStrong('StrongPass123$')).toBe(true);
  });

  it('should return false for weak passwords', () => {
    expect(isPasswordStrong('abcdefg')).toBe(false);
    expect(isPasswordStrong('ABCDEFGH')).toBe(false);
    expect(isPasswordStrong('12345678')).toBe(false);
    expect(isPasswordStrong('abcDEF12')).toBe(false);
    expect(isPasswordStrong('abcDEF!@')).toBe(false);
  });
}); 