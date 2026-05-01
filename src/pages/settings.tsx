import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';

interface Settings {
  currency: string;
  refreshRate: number;
  theme: 'light' | 'dark';
  notifications: boolean;
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    currency: 'USD',
    refreshRate: 5,
    theme: 'light',
    notifications: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', settings);
  };

  return (
    <Page title="Settings" eyebrow="Preferences">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <p className="text-sm text-slate-500">Control how values and UI preferences appear.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Refresh Rate
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.refreshRate}
                  onChange={(e) =>
                    setSettings({ ...settings, refreshRate: Number.parseInt(e.target.value, 10) })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Theme</label>
              <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1">
                {(['light', 'dark'] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setSettings({ ...settings, theme })}
                    className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition ${
                      settings.theme === theme
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <span>
                <span className="block text-sm font-medium text-slate-800">Notifications</span>
                <span className="text-sm text-slate-500">Enable browser and price alert updates.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </CardContent>
        </Card>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </form>
    </Page>
  );
}
