import ModelCard from './ModelCard';

export default function ModelGrid({ models }) {
  return (
    <section className="section">
      {models.length > 0 ? (
        <div className="grid" id="modelGrid" aria-live="polite">
          {models.map((model, index) => (
            <ModelCard
              key={`${model.providerId}-${model.id}`}
              model={model}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="empty" id="noResults">
          <span>🔭</span>
          <p>No models match your filters. Try adjusting your search.</p>
        </div>
      )}
    </section>
  );
}

