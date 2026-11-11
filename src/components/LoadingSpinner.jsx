export default function LoadingSpinner() {
  return (
    <div className="loader" id="loader">
      <div className="loader__spinner"></div>
      <p className="loader__text">Fetching live model data…</p>
    </div>
  );
}

