import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as api from '../services/api';

const mockModels = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    providerId: 'openai',
    providerName: 'OpenAI',
    status: 'active',
    inputCost: 2.5,
    outputCost: 10,
    contextTokens: 128000,
    outputLimit: 16384,
    releaseDate: new Date('2024-05-13'),
    releaseDateStr: '2024-05-13',
    raw: {
      description: 'Omni model flagship',
      reasoning: true,
      tool_call: true,
      attachment: true,
      open_weights: false,
    },
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    providerId: 'anthropic',
    providerName: 'Anthropic',
    status: 'active',
    inputCost: 3.0,
    outputCost: 15,
    contextTokens: 200000,
    outputLimit: 8192,
    releaseDate: new Date('2024-06-20'),
    releaseDateStr: '2024-06-20',
    raw: {
      description: 'Top frontier model',
      reasoning: false,
      tool_call: true,
      attachment: true,
      open_weights: false,
    },
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    providerId: 'meta',
    providerName: 'Meta',
    status: 'beta',
    inputCost: 0,
    outputCost: 0,
    contextTokens: 8192,
    outputLimit: 2048,
    releaseDate: new Date('2024-04-18'),
    releaseDateStr: '2024-04-18',
    raw: {
      description: 'Open weight LLM',
      reasoning: false,
      tool_call: false,
      attachment: false,
      open_weights: true,
    },
  },
  {
    id: 'text-davinci-003',
    name: 'text-davinci-003',
    providerId: 'openai',
    providerName: 'OpenAI',
    status: 'deprecated',
    inputCost: 20.0,
    outputCost: 20.0,
    contextTokens: 4096,
    outputLimit: 4096,
    releaseDate: new Date('2022-11-28'),
    releaseDateStr: '2022-11-28',
    raw: {
      description: 'Legacy completion model',
      reasoning: false,
      tool_call: false,
      attachment: false,
      open_weights: false,
    },
  },
];

describe('App Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially and then displays models and stats', async () => {
    vi.spyOn(api, 'fetchModels').mockResolvedValueOnce(mockModels);

    render(<App />);

    expect(screen.getByText(/fetching live model data…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    // Check Header count
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('models tracked')).toBeInTheDocument();

    // Check StatsBar
    expect(screen.getByText('Showing 4 models')).toBeInTheDocument();
    expect(screen.getByText('2 active')).toBeInTheDocument();
    expect(screen.getByText('1 deprecated')).toBeInTheDocument();
    expect(screen.getByText('1 free / $0')).toBeInTheDocument();
  });

  it('filters by keyword search', async () => {
    vi.spyOn(api, 'fetchModels').mockResolvedValueOnce(mockModels);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/search models/i);
    fireEvent.change(searchInput, { target: { value: 'claude' } });

    expect(screen.getByText('Claude 3.5 Sonnet')).toBeInTheDocument();
    expect(screen.queryByText('GPT-4o')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 model')).toBeInTheDocument();
  });

  it('filters by provider and resets properly', async () => {
    vi.spyOn(api, 'fetchModels').mockResolvedValueOnce(mockModels);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    const providerSelect = screen.getByLabelText(/provider/i);
    fireEvent.change(providerSelect, { target: { value: 'meta' } });

    expect(screen.getByText('Llama 3 70B')).toBeInTheDocument();
    expect(screen.queryByText('GPT-4o')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 model')).toBeInTheDocument();

    // Click Reset
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('Showing 4 models')).toBeInTheDocument();
    expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    expect(screen.getByText('Claude 3.5 Sonnet')).toBeInTheDocument();
  });

  it('filters by capability', async () => {
    vi.spyOn(api, 'fetchModels').mockResolvedValueOnce(mockModels);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    const capSelect = screen.getByLabelText(/capability/i);
    fireEvent.change(capSelect, { target: { value: 'open_weights' } });

    expect(screen.getByText('Llama 3 70B')).toBeInTheDocument();
    expect(screen.queryByText('GPT-4o')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 model')).toBeInTheDocument();
  });

  it('shows empty state when no models match filters', async () => {
    vi.spyOn(api, 'fetchModels').mockResolvedValueOnce(mockModels);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/search models/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent-model-xyz' } });

    expect(
      screen.getByText(/no models match your filters\. try adjusting your search\./i)
    ).toBeInTheDocument();
    expect(screen.getByText('Showing 0 models')).toBeInTheDocument();
  });

  it('displays error state and retries successfully', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchModels')
      .mockRejectedValueOnce(new Error('Network offline'))
      .mockResolvedValueOnce(mockModels);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Network offline')).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('GPT-4o')).toBeInTheDocument();
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
