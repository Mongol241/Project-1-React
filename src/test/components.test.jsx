import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import FilterForm from '../components/FilterForm';
import ModelCard from '../components/ModelCard';
import ModelGrid from '../components/ModelGrid';

describe('Components', () => {
  it('renders Header with count', () => {
    render(<Header totalCount={100} />);
    expect(screen.getByText('AI Model Watch')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('models tracked')).toBeInTheDocument();
  });

  it('renders StatsBar with correct stats', () => {
    render(
      <StatsBar
        totalShowing={50}
        activeCount={40}
        deprecatedCount={10}
        freeCount={5}
      />
    );
    expect(screen.getByText('Showing 50 models')).toBeInTheDocument();
    expect(screen.getByText('40 active')).toBeInTheDocument();
    expect(screen.getByText('10 deprecated')).toBeInTheDocument();
    expect(screen.getByText('5 free / $0')).toBeInTheDocument();
  });

  it('handles FilterForm interactions', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    const filters = {
      keyword: 'test',
      provider: '',
      status: '',
      capability: '',
      sort: 'name',
    };
    const providers = [{ id: 'openai', name: 'OpenAI' }];

    render(
      <FilterForm
        filters={filters}
        providers={providers}
        onChange={onChange}
        onReset={onReset}
      />
    );

    const input = screen.getByLabelText(/search models/i);
    expect(input.value).toBe('test');
    fireEvent.change(input, { target: { value: 'gpt' } });
    expect(onChange).toHaveBeenCalledWith('keyword', 'gpt');

    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalled();
  });

  it('renders ModelCard details correctly', () => {
    const model = {
      id: 'gpt-4o',
      name: 'GPT-4o',
      providerId: 'openai',
      providerName: 'OpenAI',
      status: 'active',
      inputCost: 2.5,
      outputCost: 10,
      contextTokens: 128000,
      outputLimit: 16384,
      releaseDateStr: '2024-05-13',
      raw: {
        description: 'Omni model flagship',
        reasoning: true,
        tool_call: true,
      },
    };

    render(<ModelCard model={model} index={0} />);
    expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('Omni model flagship')).toBeInTheDocument();
    expect(screen.getByText('128K')).toBeInTheDocument();
    expect(screen.getByText('$2.50')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('🧠 Reasoning')).toBeInTheDocument();
    expect(screen.getByText('🔧 Tool calling')).toBeInTheDocument();
  });

  it('renders empty state in ModelGrid when no models', () => {
    render(<ModelGrid models={[]} />);
    expect(
      screen.getByText(/no models match your filters/i)
    ).toBeInTheDocument();
  });
});

