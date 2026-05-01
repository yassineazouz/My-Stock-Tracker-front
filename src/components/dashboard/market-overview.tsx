import { BarChart3, Clock, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Notice } from '@/components/ui/page';
import { fetchAllStocks } from '@/lib/api';
import { formatCompact, formatCurrency, formatPercent, safeNumber } from '@/lib/format';
import { StockData } from '@/types/stock-data';

function PriceChange({ change, percentChange }: { change: number; percentChange: number }) {
  const safeChange = safeNumber(change);
  const isPositive = safeChange >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {isPositive ? '+' : ''}
      {formatPercent(percentChange)}
    </div>
  );
}

function MarketSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-3">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-100" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-28 rounded bg-slate-200" />
        <div className="mt-4 h-10 rounded bg-slate-100" />
      </CardContent>
    </Card>
  );
}

export function MarketOverview() {
  const { data: stocks, error, isLoading, mutate } = useSWR<StockData[]>('stocks', fetchAllStocks, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: Infinity,
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Market Overview</h2>
          <p className="mt-1 text-sm text-slate-500">Tracked symbols and latest quote data</p>
        </div>
        <button
          type="button"
          onClick={() => mutate()}
          disabled={isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh market data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <Notice tone="danger">
          Market data could not be loaded. Check the backend port and TwelveData API key.
        </Notice>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isLoading && !stocks
            ? Array.from({ length: 4 }).map((_, index) => <MarketSkeleton key={index} />)
            : stocks?.map((stock) => (
                <Card key={stock.symbol} className="transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b pb-4">
                    <div className="min-w-0">
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <p className="mt-1 truncate text-sm text-slate-500">{stock.name}</p>
                    </div>
                    <PriceChange change={stock.change} percentChange={stock.percentChange} />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-slate-950">
                      {formatCurrency(stock.close)}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {safeNumber(stock.change) >= 0 ? '+' : ''}
                      {formatCurrency(stock.change)} today
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <BarChart3 className="h-4 w-4" />
                          Volume
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCompact(stock.volume)}
                        </p>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Clock className="h-4 w-4" />
                          Prev Close
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCurrency(stock.previousClose)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      )}
    </section>
  );
}
