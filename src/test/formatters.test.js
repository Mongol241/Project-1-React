import { describe, it, expect } from 'vitest';
import {
  formatTokens,
  formatPrice,
  getNormalizedStatus,
  getStatusClass,
  formatReleaseDate,
  matchesFilters,
} from '../utils/formatters';

describe('formatters', () => {
  describe('formatTokens', () => {
    it('returns "—" for 0 or falsy tokens', () => {
      expect(formatTokens(0)).toBe('—');
      expect(formatTokens(null)).toBe('—');
      expect(formatTokens(undefined)).toBe('—');
    });

    it('formats millions correctly', () => {
      expect(formatTokens(1_000_000)).toBe('1.0M');
      expect(formatTokens(128_000)).toBe('128K');
      expect(formatTokens(500)).toBe('500');
    });
  });

  describe('formatPrice', () => {
    it('handles null/undefined and zero', () => {
      expect(formatPrice(null)).toBe('—');
      expect(formatPrice(undefined)).toBe('—');
      expect(formatPrice(0)).toBe('Free');
    });

    it('formats small costs with 4 decimal places', () => {
      expect(formatPrice(0.005)).toBe('$0.0050');
    });

    it('formats standard costs with 2 decimal places', () => {
      expect(formatPrice(2.5)).toBe('$2.50');
      expect(formatPrice(10)).toBe('$10.00');
    });
  });

  describe('getNormalizedStatus & getStatusClass', () => {
    it('normalizes statuses properly', () => {
      expect(getNormalizedStatus('active')).toBe('active');
      expect(getNormalizedStatus('beta')).toBe('beta');
      expect(getNormalizedStatus('deprecated')).toBe('deprecated');
      expect(getNormalizedStatus('legacy')).toBe('deprecated');
      expect(getNormalizedStatus('unknown')).toBe('active');
    });

    it('returns matching badge classes', () => {
      expect(getStatusClass('active')).toBe('badge--green');
      expect(getStatusClass('deprecated')).toBe('badge--red');
      expect(getStatusClass('beta')).toBe('badge--amber');
    });
  });

  describe('formatReleaseDate', () => {
    it('handles missing or invalid date', () => {
      expect(formatReleaseDate(null)).toBe('Release date unknown');
      expect(formatReleaseDate('invalid-date')).toBe('Release date unknown');
    });

    it('formats valid date string', () => {
      expect(formatReleaseDate('2024-05-13')).toContain('2024');
      expect(formatReleaseDate('2024-05-13')).toContain('May');
    });
  });

  describe('matchesFilters', () => {
    const sampleModel = {
      id: 'gpt-4o',
      name: 'GPT-4o',
      providerId: 'openai',
      providerName: 'OpenAI',
      status: 'active',
      raw: {
        description: 'Omni model',
        reasoning: true,
        tool_call: true,
        attachment: false,
        open_weights: false,
      },
    };

    it('matches keyword across name, id, provider, description', () => {
      expect(matchesFilters(sampleModel, { keyword: 'gpt' })).toBe(true);
      expect(matchesFilters(sampleModel, { keyword: 'openai' })).toBe(true);
      expect(matchesFilters(sampleModel, { keyword: 'omni' })).toBe(true);
      expect(matchesFilters(sampleModel, { keyword: 'claude' })).toBe(false);
    });

    it('matches provider', () => {
      expect(matchesFilters(sampleModel, { provider: 'openai' })).toBe(true);
      expect(matchesFilters(sampleModel, { provider: 'anthropic' })).toBe(false);
    });

    it('matches status', () => {
      expect(matchesFilters(sampleModel, { status: 'active' })).toBe(true);
      expect(matchesFilters(sampleModel, { status: 'deprecated' })).toBe(false);
    });

    it('matches capability flags', () => {
      expect(matchesFilters(sampleModel, { capability: 'reasoning' })).toBe(true);
      expect(matchesFilters(sampleModel, { capability: 'tool_call' })).toBe(true);
      expect(matchesFilters(sampleModel, { capability: 'attachment' })).toBe(false);
      expect(matchesFilters(sampleModel, { capability: 'open_weights' })).toBe(false);
    });
  });
});

