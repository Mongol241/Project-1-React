export default function FilterForm({
  filters,
  providers,
  onChange,
  onReset,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <section className="section">
      <form
        id="searchForm"
        className="form"
        role="search"
        aria-label="Filter models"
        onSubmit={handleSubmit}
      >
        {/* Keyword search */}
        <div className="form__group form__group--wide">
          <label htmlFor="keyword" className="form__label">🔍 Search models</label>
          <input
            type="search"
            id="keyword"
            name="keyword"
            className="form__input"
            placeholder="e.g. gpt, claude, gemini, llama…"
            autoComplete="off"
            value={filters.keyword}
            onChange={(e) => onChange('keyword', e.target.value)}
          />
        </div>

        {/* Provider filter */}
        <div className="form__group">
          <label htmlFor="providerFilter" className="form__label">🏢 Provider</label>
          <select
            id="providerFilter"
            name="provider"
            className="form__select"
            value={filters.provider}
            onChange={(e) => onChange('provider', e.target.value)}
          >
            <option value="">All providers</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="form__group">
          <label htmlFor="statusFilter" className="form__label">📌 Status</label>
          <select
            id="statusFilter"
            name="status"
            className="form__select"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="deprecated">Deprecated</option>
            <option value="beta">Beta</option>
          </select>
        </div>

        {/* Capability filter */}
        <div className="form__group">
          <label htmlFor="capFilter" className="form__label">✨ Capability</label>
          <select
            id="capFilter"
            name="capability"
            className="form__select"
            value={filters.capability}
            onChange={(e) => onChange('capability', e.target.value)}
          >
            <option value="">Any capability</option>
            <option value="reasoning">Reasoning</option>
            <option value="tool_call">Tool calling</option>
            <option value="attachment">Attachments/Vision</option>
            <option value="open_weights">Open weights</option>
          </select>
        </div>

        {/* Sort */}
        <div className="form__group">
          <label htmlFor="sortBy" className="form__label">↕️ Sort by</label>
          <select
            id="sortBy"
            name="sort"
            className="form__select"
            value={filters.sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            <option value="name">Name A–Z</option>
            <option value="context_desc">Context window ↓</option>
            <option value="cost_asc">Input price ↑</option>
            <option value="cost_desc">Input price ↓</option>
            <option value="release_desc">Newest first</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="form__group form__group--actions">
          <button type="submit" className="btn btn--primary" id="applyBtn">
            Apply
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            id="resetBtn"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

