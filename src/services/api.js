import { getNormalizedStatus } from '../utils/formatters';

const DEFAULT_API_URL = 'https://models.dev/api.json';

export async function fetchModels(signal) {
  const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  const res = await fetch(apiUrl, { signal });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const list = [];

  for (const [providerId, provider] of Object.entries(data || {})) {
    for (const [modelId, raw] of Object.entries(provider.models || {})) {
      list.push({
        id: modelId,
        raw: raw || {},
        providerId,
        providerName: provider.name || providerId,
        name: raw?.name || modelId,
        inputCost: raw?.cost?.input ?? null,
        outputCost: raw?.cost?.output ?? null,
        contextTokens: raw?.limit?.context ?? 0,
        outputLimit: raw?.limit?.output ?? null,
        status: getNormalizedStatus(raw?.status),
        releaseDate: raw?.release_date ? new Date(raw.release_date) : null,
        releaseDateStr: raw?.release_date || null,
      });
    }
  }

  // Slice all API data to 100 as in original script.js
  return list.slice(0, 100);
}

