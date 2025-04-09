import React from 'react';
import { Bell, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface PriceAlert {
  id: string;
  symbol: string;
  companyName: string;
  targetPrice: number;
  currentPrice: number;
  type: 'above' | 'below';
  createdAt: string;
}

const mockAlerts: PriceAlert[] = [
  {
    id: '1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    targetPrice: 180.00,
    currentPrice: 175.50,
    type: 'above',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    targetPrice: 300.00,
    currentPrice: 310.25,
    type: 'below',
    createdAt: '2024-03-14'
  },
  {
    id: '3',
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    targetPrice: 3000.00,
    currentPrice: 2950.75,
    type: 'above',
    createdAt: '2024-03-13'
  }
];

export function AlertList() {
  const handleDeleteAlert = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete alert:', id);
  };

  return (
    <div className="space-y-4">
      {mockAlerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              alert.type === 'above' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {alert.type === 'above' ? (
                <ArrowUpCircle className="w-6 h-6 text-green-600" />
              ) : (
                <ArrowDownCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{alert.symbol}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{alert.companyName}</span>
              </div>
              <div className="text-sm text-gray-500">
                Alert when price goes {alert.type}{' '}
                <span className="font-medium">${alert.targetPrice.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-400">
                Current price: ${alert.currentPrice.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDeleteAlert(alert.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}