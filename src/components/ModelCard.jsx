import {
  formatTokens,
  formatPrice,
  getStatusClass,
  formatReleaseDate,
} from '../utils/formatters';

export default function ModelCard({ model, index }) {
  const animationDelay = `${Math.min(index * 25, 400)}ms`;
  const ariaLabel = `${model.name} by ${model.providerName}`;
  const statusClass = getStatusClass(model.status);

  const hasCaps =
    model.raw.reasoning ||
    model.raw.tool_call ||
    model.raw.attachment ||
    model.raw.open_weights;

  return (
    <article
      className="card"
      style={{ animationDelay }}
      aria-label={ariaLabel}
    >
      <div className="card__header">
        <div>
          <div className="card__title">{model.name}</div>
          <div className="card__provider">{model.providerName}</div>
        </div>
        <span className={`badge ${statusClass}`}>{model.status}</span>
      </div>

      {model.raw.description && (
        <p className="card__desc">{model.raw.description}</p>
      )}

      <div className="card__stats">
        <div className="stat">
          <div className="stat__label">Context</div>
          <div className="stat__value">
            {formatTokens(model.contextTokens)}
          </div>
        </div>
        <div className="stat">
          <div className="stat__label">Output</div>
          <div className="stat__value">
            {model.outputLimit ? formatTokens(model.outputLimit) : '—'}
          </div>
        </div>
        <div className="stat">
          <div className="stat__label">Input / 1M</div>
          <div
            className={`stat__value ${
              model.inputCost === 0 ? 'stat__value--free' : ''
            }`}
          >
            {formatPrice(model.inputCost)}
          </div>
        </div>
        <div className="stat">
          <div className="stat__label">Output / 1M</div>
          <div className="stat__value">
            {formatPrice(model.outputCost)}
          </div>
        </div>
      </div>

      {hasCaps && (
        <div className="card__caps">
          {model.raw.reasoning && (
            <span className="badge badge--purple">🧠 Reasoning</span>
          )}
          {model.raw.tool_call && (
            <span className="badge badge--blue">🔧 Tool calling</span>
          )}
          {model.raw.attachment && (
            <span className="badge badge--amber">🖼️ Vision/Files</span>
          )}
          {model.raw.open_weights && (
            <span className="badge badge--green">🔓 Open weights</span>
          )}
        </div>
      )}

      <div className="card__date">📅 {formatReleaseDate(model.releaseDateStr)}</div>
    </article>
  );
}

