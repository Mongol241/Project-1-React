import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterForm from './components/FilterForm';
import StatsBar from './components/StatsBar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBox from './components/ErrorBox';
import ModelGrid from './components/ModelGrid';
import Footer from './components/Footer';
import { fetchModels } from './services/api';
import { matchesFilters } from './utils/formatters';

const INITIAL_FILTERS = {
  keyword: '',
  provider: '',
  status: '',
  capability: '',
  sort: 'name',
};

export default function App() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchModels();
      setModels(data);
    } catch (err) {
      setError(err.message || 'Could not load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique providers sorted alphabetically by providerName
  const providers = useMemo(() => {
    const map = new Map();
    for (const model of models) {
      if (!map.has(model.providerId)) {
        map.set(model.providerId, model.providerName);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [models]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filtered and sorted models
  const filteredModels = useMemo(() => {
    const trimmedKeyword = filters.keyword.trim().toLowerCase();
    const criteria = {
      keyword: trimmedKeyword,
      provider: filters.provider,
      status: filters.status,
      capability: filters.capability,
    };

    return models
      .filter((model) => matchesFilters(model, criteria))
      .sort((a, b) => {
        if (filters.sort === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (filters.sort === 'context_desc') {
          return b.contextTokens - a.contextTokens;
        }
        if (filters.sort === 'cost_asc') {
          return (a.inputCost ?? Infinity) - (b.inputCost ?? Infinity);
        }
        if (filters.sort === 'cost_desc') {
          return (b.inputCost ?? -Infinity) - (a.inputCost ?? -Infinity);
        }
        if (filters.sort === 'release_desc') {
          const dateA = a.releaseDate ? a.releaseDate.getTime() : 0;
          const dateB = b.releaseDate ? b.releaseDate.getTime() : 0;
          return dateB - dateA;
        }
        return 0;
      });
  }, [models, filters]);

  // Stats calculation
  const stats = useMemo(() => {
    if (loading && models.length === 0) {
      return {
        showing: null,
        active: null,
        deprecated: null,
        free: null,
      };
    }
    const active = filteredModels.filter((m) => m.status === 'active').length;
    const deprecated = filteredModels.filter((m) => m.status === 'deprecated').length;
    const free = filteredModels.filter((m) => m.inputCost === 0).length;

    return {
      showing: filteredModels.length,
      active,
      deprecated,
      free,
    };
  }, [filteredModels, loading, models.length]);

  return (
    <>
      <Header totalCount={loading && models.length === 0 ? null : models.length} />

      <main className="container">
        <FilterForm
          filters={filters}
          providers={providers}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSubmit={() => {}}
        />

        <StatsBar
          totalShowing={stats.showing}
          activeCount={stats.active}
          deprecatedCount={stats.deprecated}
          freeCount={stats.free}
        />

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <ErrorBox message={error} onRetry={loadData} />
        )}

        {!loading && !error && <ModelGrid models={filteredModels} />}
      </main>

      <Footer />
    </>
  );
}

