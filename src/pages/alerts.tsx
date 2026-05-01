import { FormEvent, useEffect, useState } from 'react';
import { Bell, Plus, X } from 'lucide-react';
import { AlertList } from '@/components/alerts/alert-list';
import { Notice, Page } from '@/components/ui/page';
import { createAlert, deleteAlert, fetchAlerts } from '@/lib/api';
import { PriceAlert, PriceAlertRequest } from '@/types/PriceAlert';

const initialForm: PriceAlertRequest = {
  symbol: '',
  companyName: '',
  targetPrice: 0,
  direction: 'ABOVE',
};

export function Alerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [form, setForm] = useState<PriceAlertRequest>(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setIsLoading(true);
      setError(null);
      setAlerts(await fetchAlerts());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const saved = await createAlert({
        ...form,
        symbol: form.symbol.trim().toUpperCase(),
        companyName: form.companyName?.trim(),
        targetPrice: Number(form.targetPrice),
      });
      setAlerts((current) => [saved, ...current]);
      setForm(initialForm);
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(alertId: number) {
    setDeletingId(alertId);
    setError(null);

    try {
      await deleteAlert(alertId);
      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Page
      title="Price Alerts"
      eyebrow="Notifications"
      actions={
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      }
    >
      <div className="max-w-4xl space-y-4">
        {error && <Notice tone="danger">{error}</Notice>}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <Bell className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">Create alert</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track a symbol when it moves above or below your target.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close alert form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Symbol</span>
                <input
                  required
                  value={form.symbol}
                  onChange={(event) => setForm({ ...form, symbol: event.target.value })}
                  placeholder="AAPL"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus:border-slate-500"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Company</span>
                <input
                  value={form.companyName}
                  onChange={(event) => setForm({ ...form, companyName: event.target.value })}
                  placeholder="Apple Inc."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Target price</span>
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={form.targetPrice || ''}
                  onChange={(event) =>
                    setForm({ ...form, targetPrice: Number(event.target.value) })
                  }
                  placeholder="180.00"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Direction</span>
                <select
                  value={form.direction}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      direction: event.target.value as PriceAlertRequest['direction'],
                    })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                >
                  <option value="ABOVE">Above target</option>
                  <option value="BELOW">Below target</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save alert'}
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <Notice>Loading alerts...</Notice>
        ) : (
          <AlertList alerts={alerts} deletingId={deletingId} onDelete={handleDelete} />
        )}
      </div>
    </Page>
  );
}
