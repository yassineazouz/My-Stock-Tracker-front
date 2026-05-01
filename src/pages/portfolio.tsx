import React, { useCallback, useMemo, useState } from 'react';
import { Plus, Wallet, X } from 'lucide-react';
import useSWR from 'swr';
import { PortfolioTable } from '@/components/portfolio/portfolio-table';
import { Notice, Page } from '@/components/ui/page';
import { buyStock, fetchAllStocks } from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Stock } from '@/types/Stock';
import { StockData } from '@/types/stock-data';

interface StockFormData {
  symbol: string;
  quantity: number;
}

const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
];

const defaultForm: StockFormData = {
  symbol: '',
  quantity: 0,
};

export function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<StockFormData>(defaultForm);
  const username = 'yassine';

  const { data: portfolioData, error: portfolioError, mutate } = usePortfolio();
  const { data: marketData, error: marketError, isLoading: isMarketLoading } = useSWR<StockData[]>(
    'stocks',
    fetchAllStocks
  );

  const stocks = portfolioData?.stocks ?? [];

  const livePrice = useCallback(
    (symbol: string): number => marketData?.find((stock) => stock.symbol === symbol)?.close ?? 0,
    [marketData]
  );

  const selectedStock = useMemo(
    () => AVAILABLE_STOCKS.find((stock) => stock.symbol === formData.symbol),
    [formData.symbol]
  );

  const currentPrice = formData.symbol ? livePrice(formData.symbol) : 0;
  const totalValue = currentPrice * formData.quantity;
  const canSubmit = Boolean(formData.symbol && formData.quantity > 0 && currentPrice > 0);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(defaultForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const newStock: Stock = {
      symbol: formData.symbol,
      companyName: selectedStock?.name ?? `${formData.symbol} Inc.`,
      quantity: formData.quantity,
      purchasePrice: currentPrice,
      currentPrice,
      totalValue: Number(totalValue.toFixed(2)),
      gainLoss: 0,
      gainLossPercentage: 0,
    };

    try {
      await buyStock(username, newStock);
      closeModal();
      mutate();
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  return (
    <Page
      title="Portfolio"
      eyebrow="Holdings"
      actions={
        <>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Wallet className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold">{formatCurrency(portfolioData?.walletValue)}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Stock
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {portfolioError && (
          <Notice tone="danger">Portfolio could not be loaded. Check the backend connection.</Notice>
        )}
        <PortfolioTable stocks={stocks} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Add Stock</h2>
                <p className="text-sm text-slate-500">Create a new position in your portfolio.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {marketError && (
                <Notice tone="danger">Market prices are unavailable. Try again after refreshing data.</Notice>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Stock Symbol</label>
                <select
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500"
                  value={formData.symbol}
                  onChange={(e) => setFormData((prev) => ({ ...prev, symbol: e.target.value }))}
                >
                  <option value="">Select a stock</option>
                  {AVAILABLE_STOCKS.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                  value={formData.quantity || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Math.max(0, Number.parseInt(e.target.value, 10) || 0),
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">Market Price</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {isMarketLoading ? 'Loading...' : formatCurrency(currentPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Order Value</p>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(totalValue)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
}
