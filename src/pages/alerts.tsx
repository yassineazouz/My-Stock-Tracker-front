import React, { useState } from 'react';
import { AlertList } from '@/components/alerts/alert-list';
import { Plus } from 'lucide-react';

export function Alerts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Price Alerts</h1>
          <p className="text-gray-500 mt-2">Get notified when stocks hit your target prices</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          New Alert
        </button>
      </div>

      <div className="max-w-4xl">
        <AlertList />
      </div>

      {/* TODO: Add Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Alert</h2>
            {/* TODO: Add form fields */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  // TODO: Handle alert creation
                  setIsModalOpen(false);
                }}
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}