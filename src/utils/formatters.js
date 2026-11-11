/**
 * Utility functions for formatting model data.
 */

export function formatTokens(tokens) {
  if (!tokens) return '—';
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  return tokens >= 1_000 ? `${Math.round(tokens / 1_000)}K` : tokens.toLocaleString();
}

export function formatPrice(cost) {
  if (cost === null || cost === undefined) return '—';
  if (cost === 0) return 'Free';
  return cost < 0.01 ? `$${cost.toFixed(4)}` : `$${cost.toFixed(2)}`;
}

export function getNormalizedStatus(rawStatus) {
  if (rawStatus === 'deprecated' || rawStatus === 'legacy') return 'deprecated';
  if (rawStatus === 'beta') return 'beta';
  return 'active';
}

export function getStatusClass(status) {
  const map = {
    active: 'badge--green',
    deprecated: 'badge--red',
    beta: 'badge--amber',
  };
  return map[status] || '';
}

export function formatReleaseDate(releaseDateStr) {
  if (!releaseDateStr) return 'Release date unknown';
  const date = new Date(releaseDateStr);
  if (isNaN(date.getTime())) return 'Release date unknown';
  return `Released ${date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}`;
}

export function matchesFilters(model, { keyword, provider, status, capability }) {
  if (keyword) {
    const haystack = `${model.name} ${model.id} ${model.providerName} ${model.raw.description || ''}`.toLowerCase();
    if (!haystack.includes(keyword)) return false;
  }
  if (provider && model.providerId !== provider) return false;
  if (status && model.status !== status) return false;
  if (capability === 'reasoning' && !model.raw.reasoning) return false;
  if (capability === 'tool_call' && !model.raw.tool_call) return false;
  if (capability === 'attachment' && !model.raw.attachment) return false;
  if (capability === 'open_weights' && !model.raw.open_weights) return false;
  return true;
}

