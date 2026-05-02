import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { PriceAlert } from '@/types/PriceAlert';

interface AlertListProps {
  alerts: PriceAlert[];
  deletingId?: number | null;
  onDelete: (alertId: number) => void;
}

export function AlertList({ alerts, deletingId, onDelete }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mb-3 rounded-lg bg-slate-100 p-3 text-slate-500">
          <ArrowUpCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-950">No alerts yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Add a price alert to watch a symbol and keep your portfolio moves visible.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-100">
        {alerts.map((alert) => {
          const isAbove = alert.direction === 'ABOVE';
          const Icon = isAbove ? ArrowUpCircle : ArrowDownCircle;
          const tone =
            !alert.active
              ? 'bg-slate-100 text-slate-500'
              : isAbove
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700';
          const createdAt = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
          }).format(new Date(alert.createdAt));
          const triggeredAt = alert.triggeredAt
            ? new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(alert.triggeredAt))
            : null;

          return (
            <div key={alert.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`rounded-lg p-2 ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-950">{alert.symbol}</span>
                    <span className="truncate text-sm text-slate-500">{alert.companyName}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        alert.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.active ? 'Active' : 'Triggered'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Trigger {isAbove ? 'above' : 'below'} {formatCurrency(alert.targetPrice)}
                  </p>
                  {triggeredAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Triggered at {formatCurrency(alert.triggeredPrice)} on {triggeredAt}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {alert.currentPrice > 0 ? formatCurrency(alert.currentPrice) : 'No quote'}
                  </p>
                  <p className="text-xs text-slate-500">{createdAt}</p>
                </div>
                <button
                  type="button"
                  disabled={deletingId === alert.id}
                  onClick={() => onDelete(alert.id)}
                  className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${alert.symbol} alert`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
