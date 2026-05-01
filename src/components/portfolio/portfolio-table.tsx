import { ArrowDownIcon, ArrowUpIcon, LineChart } from 'lucide-react';
import { formatCurrency, formatPercent, safeNumber } from '@/lib/format';
import { Stock } from '@/types/Stock';

interface PortfolioTableProps {
  stocks: Stock[];
}

export function PortfolioTable({ stocks }: PortfolioTableProps) {
  if (stocks.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mb-3 rounded-lg bg-slate-100 p-3 text-slate-500">
          <LineChart className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-950">No holdings yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Add your first stock position to start tracking value, quantity, and performance.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 text-left font-semibold">Symbol</th>
              <th className="px-5 py-3 text-left font-semibold">Company</th>
              <th className="px-5 py-3 text-right font-semibold">Quantity</th>
              <th className="px-5 py-3 text-right font-semibold">Purchase</th>
              <th className="px-5 py-3 text-right font-semibold">Current</th>
              <th className="px-5 py-3 text-right font-semibold">Value</th>
              <th className="px-5 py-3 text-right font-semibold">Gain/Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.map((stock) => {
              const gainLoss = safeNumber(stock.gainLoss);
              const gainLossPercentage = safeNumber(stock.gainLossPercentage);
              const isPositive = gainLoss >= 0;
              const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

              return (
                <tr key={stock.id ?? stock.symbol} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-950">{stock.symbol}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{stock.companyName}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{stock.quantity}</td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {formatCurrency(stock.purchasePrice)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {formatCurrency(stock.currentPrice)}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-slate-900">
                    {formatCurrency(stock.totalValue)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {formatCurrency(Math.abs(gainLoss))} ({formatPercent(gainLossPercentage)})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
