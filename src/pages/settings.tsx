import React, { useState } from 'react';
import { Save } from 'lucide-react';

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
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Rate (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.refreshRate}
                onChange={(e) => setSettings({ ...settings, refreshRate: parseInt(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="light"
                    checked={settings.theme === 'light'}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                    className="mr-2"
                  />
                  Light
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="dark"
                    checked={settings.theme === 'dark'}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
                    className="mr-2"
                  />
                  Dark
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Notifications
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}