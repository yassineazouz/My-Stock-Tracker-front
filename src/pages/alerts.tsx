import { FormEvent, useState } from 'react';
import { Bell, Plus, X } from 'lucide-react';
import useSWR from 'swr';
import { AlertList } from '@/components/alerts/alert-list';
import { Notice, Page } from '@/components/ui/page';
import { checkAlertsNow, createAlert, deleteAlert, fetchAlerts, getCurrentUsername } from '@/lib/api';
import { PriceAlert, PriceAlertRequest } from '@/types/PriceAlert';

const initialForm: PriceAlertRequest = {
  symbol: '',
  companyName: '',
  targetPrice: 0,
  direction: 'ABOVE',
};

export function Alerts() {
  const { data: alerts = [], error: loadError, isLoading, mutate } = useSWR<PriceAlert[]>(
    ['alerts', getCurrentUsername()],
    () => fetchAlerts()
  );
  const [form, setForm] = useState<PriceAlertRequest>(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);
    setMessage(null);

    try {
      const saved = await createAlert({
        ...form,
        symbol: form.symbol.trim().toUpperCase(),
        companyName: form.companyName?.trim(),
        targetPrice: Number(form.targetPrice),
      });
      await mutate((current) => [saved, ...(current ?? [])], { revalidate: false });
      setForm(initialForm);
      setIsFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(alertId: number) {
    setDeletingId(alertId);
    setActionError(null);
    setMessage(null);

    try {
      await deleteAlert(alertId);
      await mutate((current) => current?.filter((a) => a.id !== alertId), { revalidate: false });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete alert');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCheckNow() {
    setIsChecking(true);
    setActionError(null);
    setMessage(null);

    try {
      const triggered = await checkAlertsNow();
      if (triggered.length > 0) {
        await mutate(
          (current) =>
            current?.map((alert) => triggered.find((triggeredAlert) => triggeredAlert.id === alert.id) ?? alert),
          { revalidate: false }
        );
      }
      setMessage(
        triggered.length === 1 ? '1 alert was triggered.' : `${triggered.length} alerts were triggered.`
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to check alerts');
    } finally {
      setIsChecking(false);
    }
  }

  const displayError =
    actionError ?? (loadError instanceof Error ? loadError.message : loadError ? 'Failed to load alerts' : null);

  return (
    <Page
      title="Price Alerts"
      eyebrow="Notifications"
      actions={
        <>
          <button
            type="button"
            onClick={handleCheckNow}
            disabled={isChecking}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking ? 'Checking...' : 'Check now'}
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Alert
          </button>
        </>
      }
    >
      <div className="max-w-4xl space-y-4">
        {displayError && <Notice tone="danger">{displayError}</Notice>}
        {message && <Notice tone="success">{message}</Notice>}

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
