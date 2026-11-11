export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="error" id="errorBox">
      <p className="error__icon">⚠️</p>
      <p className="error__msg" id="errorMsg">
        {message || 'Could not load data. Please check your connection and try again.'}
      </p>
      <button type="button" className="btn btn--primary" id="retryBtn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

