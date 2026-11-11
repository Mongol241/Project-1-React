export default function StatsBar({ totalShowing, activeCount, deprecatedCount, freeCount }) {
  const showingText = totalShowing !== null && totalShowing !== undefined
    ? `Showing ${totalShowing.toLocaleString()} model${totalShowing !== 1 ? 's' : ''}`
    : 'Showing — models';

  const activeText = activeCount !== null && activeCount !== undefined
    ? `${activeCount.toLocaleString()} active`
    : '— active';

  const deprecatedText = deprecatedCount !== null && deprecatedCount !== undefined
    ? `${deprecatedCount.toLocaleString()} deprecated`
    : '— deprecated';

  const freeText = freeCount !== null && freeCount !== undefined
    ? `${freeCount.toLocaleString()} free / $0`
    : '— free / $0';

  return (
    <div className="stats" id="statsBar">
      <span className="badge" id="statShowing">{showingText}</span>
      <span className="badge badge--green" id="statActive">{activeText}</span>
      <span className="badge badge--red" id="statDeprecated">{deprecatedText}</span>
      <span className="badge badge--blue" id="statFree">{freeText}</span>
    </div>
  );
}

