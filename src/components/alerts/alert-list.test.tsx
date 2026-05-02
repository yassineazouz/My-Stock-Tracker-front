import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AlertList } from './alert-list';
import { PriceAlert } from '@/types/PriceAlert';

const baseAlert: PriceAlert = {
  id: 1,
  symbol: 'AAPL',
  companyName: 'Apple Inc.',
  targetPrice: 180,
  currentPrice: 175,
  direction: 'ABOVE',
  active: true,
  createdAt: '2026-05-01T12:00:00Z',
};

describe('AlertList', () => {
  it('renders an empty state', () => {
    render(<AlertList alerts={[]} onDelete={vi.fn()} />);

    expect(screen.getByText('No alerts yet')).toBeInTheDocument();
  });

  it('renders active alerts with target price', () => {
    render(<AlertList alerts={[baseAlert]} onDelete={vi.fn()} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Trigger above $180.00')).toBeInTheDocument();
  });

  it('renders triggered metadata', () => {
    render(
      <AlertList
        alerts={[
          {
            ...baseAlert,
            active: false,
            triggeredAt: '2026-05-01T13:30:00Z',
            triggeredPrice: 181.5,
          },
        ]}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Triggered')).toBeInTheDocument();
    expect(screen.getByText(/Triggered at \$181\.50/)).toBeInTheDocument();
  });

  it('calls onDelete when delete is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<AlertList alerts={[baseAlert]} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: 'Delete AAPL alert' }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
