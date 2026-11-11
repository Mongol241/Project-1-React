export default function Header({ totalCount }) {
  const displayCount = totalCount !== null && totalCount !== undefined ? totalCount.toLocaleString() : '—';

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <span className="header__icon">🤖</span>
          <div>
            <h1 className="header__title">AI Model Watch</h1>
            <p className="header__sub">Live prices · Context windows · Deprecation dates</p>
          </div>
        </div>
        <div className="header__count" id="modelCount">
          <span className="header__num" id="totalModels">{displayCount}</span>
          <span className="header__label">models tracked</span>
        </div>
      </div>
    </header>
  );
}

