/**
 * AI Model Watch — script.js
 * Slices API data to 100 models and manages the dashboard using ES6 classes.
 * API: https://models.dev/api.json
 */
const API_URL = 'https://models.dev/api.json';

class Model {
  constructor(id, data, providerId, providerName) {
    this.id = id;
    this.raw = data || {};
    this.providerId = providerId;
    this.providerName = providerName;
  }

  get name() { return this.raw.name || this.id; }
  get inputCost() { return this.raw.cost?.input ?? null; }
  get outputCost() { return this.raw.cost?.output ?? null; }
  get contextTokens() { return this.raw.limit?.context ?? 0; }
  get outputLimit() { return this.raw.limit?.output ?? null; }

  get status() {
    const s = this.raw.status;
    return (s === 'deprecated' || s === 'legacy') ? 'deprecated' : (s === 'beta' ? 'beta' : 'active');
  }

  get statusClass() {
    return { active: 'badge--green', deprecated: 'badge--red', beta: 'badge--amber' }[this.status] || '';
  }

  get releaseDate() {
    return this.raw.release_date ? new Date(this.raw.release_date) : null;
  }

  get releaseText() {
    if (!this.releaseDate || isNaN(this.releaseDate.getTime())) return 'Release date unknown';
    return `Released ${this.releaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
  }

  formatTokens(tokens) {
    if (!tokens) return '—';
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
    return tokens >= 1_000 ? `${Math.round(tokens / 1_000)}K` : tokens.toLocaleString();
  }

  formatPrice(cost) {
    if (cost === null || cost === undefined) return '—';
    if (cost === 0) return 'Free';
    return cost < 0.01 ? `$${cost.toFixed(4)}` : `$${cost.toFixed(2)}`;
  }

  matches({ keyword, provider, status, cap }) {
    if (keyword) {
      const haystack = `${this.name} ${this.id} ${this.providerName} ${this.raw.description || ''}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (provider && this.providerId !== provider) return false;
    if (status && this.status !== status) return false;
    if (cap === 'reasoning' && !this.raw.reasoning) return false;
    if (cap === 'tool_call' && !this.raw.tool_call) return false;
    if (cap === 'attachment' && !this.raw.attachment) return false;
    if (cap === 'open_weights' && !this.raw.open_weights) return false;
    return true;
  }

  toHTML(index) {
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const caps = [
      this.raw.reasoning && '<span class="badge badge--purple">🧠 Reasoning</span>',
      this.raw.tool_call && '<span class="badge badge--blue">🔧 Tool calling</span>',
      this.raw.attachment && '<span class="badge badge--amber">🖼️ Vision/Files</span>',
      this.raw.open_weights && '<span class="badge badge--green">🔓 Open weights</span>'
    ].filter(Boolean).join('');

    return `
      <article class="card" style="animation-delay:${Math.min(index * 25, 400)}ms" aria-label="${esc(this.name)} by ${esc(this.providerName)}">
        <div class="card__header">
          <div>
            <div class="card__title">${esc(this.name)}</div>
            <div class="card__provider">${esc(this.providerName)}</div>
          </div>
          <span class="badge ${this.statusClass}">${this.status}</span>
        </div>
        ${this.raw.description ? `<p class="card__desc">${esc(this.raw.description)}</p>` : ''}
        <div class="card__stats">
          <div class="stat"><div class="stat__label">Context</div><div class="stat__value">${this.formatTokens(this.contextTokens)}</div></div>
          <div class="stat"><div class="stat__label">Output</div><div class="stat__value">${this.outputLimit ? this.formatTokens(this.outputLimit) : '—'}</div></div>
          <div class="stat"><div class="stat__label">Input / 1M</div><div class="stat__value ${this.inputCost === 0 ? 'stat__value--free' : ''}">${this.formatPrice(this.inputCost)}</div></div>
          <div class="stat"><div class="stat__label">Output / 1M</div><div class="stat__value">${this.formatPrice(this.outputCost)}</div></div>
        </div>
        ${caps ? `<div class="card__caps">${caps}</div>` : ''}
        <div class="card__date">📅 ${this.releaseText}</div>
      </article>`;
  }
}

class ModelDashboard {
  constructor() {
    this.models = [];
    this.bindDOM();
    this.bindEvents();
    this.fetchData();
  }

  bindDOM() {
    this.grid = document.getElementById('modelGrid');
    this.loader = document.getElementById('loader');
    this.errorBox = document.getElementById('errorBox');
    this.errorMsg = document.getElementById('errorMsg');
    this.noResults = document.getElementById('noResults');
    this.totalModels = document.getElementById('totalModels');
    this.form = document.getElementById('searchForm');
    this.keyword = document.getElementById('keyword');
    this.providerFilter = document.getElementById('providerFilter');
    this.statusFilter = document.getElementById('statusFilter');
    this.capFilter = document.getElementById('capFilter');
    this.sortBy = document.getElementById('sortBy');
    this.resetBtn = document.getElementById('resetBtn');
    this.retryBtn = document.getElementById('retryBtn');
    this.statShowing = document.getElementById('statShowing');
    this.statActive = document.getElementById('statActive');
    this.statDeprecated = document.getElementById('statDeprecated');
    this.statFree = document.getElementById('statFree');
  }

  bindEvents() {
    this.form.addEventListener('submit', e => { e.preventDefault(); this.render(); });
    this.form.addEventListener('input', () => this.render());
    this.form.addEventListener('change', () => this.render());
    this.resetBtn.addEventListener('click', () => {
      this.form.reset();
      this.render();
    });
    this.retryBtn.addEventListener('click', () => this.fetchData());
  }

  async fetchData() {
    this.setLoading(true);
    this.errorBox.classList.add('hidden');

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      const list = [];
      for (const [pId, p] of Object.entries(data)) {
        for (const [mId, m] of Object.entries(p.models || {})) {
          list.push(new Model(mId, m, pId, p.name || pId));
        }
      }

      // Slice all API data to 100
      this.models = list.slice(0, 100);
      this.populateProviders();
      this.totalModels.textContent = this.models.length.toLocaleString();
      this.setLoading(false);
      this.render();
    } catch (err) {
      this.setLoading(false);
      this.errorMsg.textContent = err.message || 'Unknown error. Check connection.';
      this.errorBox.classList.remove('hidden');
    }
  }

  populateProviders() {
    const providers = Array.from(new Map(this.models.map(m => [m.providerId, m.providerName])).entries())
      .sort((a, b) => a[1].localeCompare(b[1]));

    this.providerFilter.innerHTML = '<option value="">All providers</option>';
    providers.forEach(([id, name]) => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = name;
      this.providerFilter.appendChild(opt);
    });
  }

  render() {
    const filters = {
      keyword: this.keyword.value.trim().toLowerCase(),
      provider: this.providerFilter.value,
      status: this.statusFilter.value,
      cap: this.capFilter.value
    };

    const sort = this.sortBy.value;
    const filtered = this.models.filter(m => m.matches(filters)).sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'context_desc') return b.contextTokens - a.contextTokens;
      if (sort === 'cost_asc') return (a.inputCost ?? Infinity) - (b.inputCost ?? Infinity);
      if (sort === 'cost_desc') return (b.inputCost ?? -Infinity) - (a.inputCost ?? -Infinity);
      if (sort === 'release_desc') return (b.releaseDate || 0) - (a.releaseDate || 0);
      return 0;
    });

    const active = filtered.filter(m => m.status === 'active').length;
    const deprecated = filtered.filter(m => m.status === 'deprecated').length;
    const free = filtered.filter(m => m.inputCost === 0).length;

    this.statShowing.textContent = `Showing ${filtered.length.toLocaleString()} model${filtered.length !== 1 ? 's' : ''}`;
    this.statActive.textContent = `${active.toLocaleString()} active`;
    this.statDeprecated.textContent = `${deprecated.toLocaleString()} deprecated`;
    this.statFree.textContent = `${free.toLocaleString()} free / $0`;

    this.noResults.classList.toggle('hidden', filtered.length > 0);
    this.grid.innerHTML = filtered.map((m, i) => m.toHTML(i)).join('');
  }

  setLoading(on) {
    this.loader.classList.toggle('hidden', !on);
    this.grid.classList.toggle('hidden', on);
  }
}

document.addEventListener('DOMContentLoaded', () => new ModelDashboard());
