import React, { useState } from 'react';
import { PortfolioTable, Stock } from '@/components/portfolio/portfolio-table';
import { Plus, X } from 'lucide-react';

interface StockFormData {
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

// Mock company names for demo purposes
const companyNames: { [key: string]: string } = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'META': 'Meta Platforms Inc.',
  'TSLA': 'Tesla Inc.',
  'NVDA': 'NVIDIA Corporation',
  'NFLX': 'Netflix Inc.',
};

export function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([
    {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      quantity: 10,
      purchasePrice: 150.00,
      currentPrice: 175.50,
      totalValue: 1755.00,
      gainLoss: 255.00,
      gainLossPercentage: 17.00
    },
    {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      quantity: 5,
      purchasePrice: 280.00,
      currentPrice: 310.25,
      totalValue: 1551.25,
      gainLoss: 151.25,
      gainLossPercentage: 10.80
    }
  ]);
  const [formData, setFormData] = useState<StockFormData>({
    symbol: '',
    quantity: 0,
    purchasePrice: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof StockFormData
  ) => {
    const value = e.target.value;
    switch (field) {
      case 'symbol':
        setFormData(prev => ({ ...prev, symbol: value.toUpperCase() }));
        break;
      case 'quantity':
        const quantity = parseInt(value) || 0;
        setFormData(prev => ({ ...prev, quantity: Math.max(0, quantity) }));
        break;
      case 'purchasePrice':
        const price = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, purchasePrice: Math.max(0, price) }));
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol || formData.quantity <= 0 || formData.purchasePrice <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    // Check if stock already exists
    if (stocks.some(stock => stock.symbol === formData.symbol)) {
      alert('This stock is already in your portfolio');
      return;
    }

    // Calculate values
    const currentPrice = formData.purchasePrice * (1 + (Math.random() * 0.2 - 0.1));
    const totalValue = currentPrice * formData.quantity;
    const gainLoss = totalValue - (formData.purchasePrice * formData.quantity);
    const gainLossPercentage = (gainLoss / (formData.purchasePrice * formData.quantity)) * 100;

    const newStock: Stock = {
      symbol: formData.symbol,
      companyName: companyNames[formData.symbol] || `${formData.symbol} Inc.`,
      quantity: formData.quantity,
      purchasePrice: formData.purchasePrice,
      currentPrice: Number(currentPrice.toFixed(2)),
      totalValue: Number(totalValue.toFixed(2)),
      gainLoss: Number(gainLoss.toFixed(2)),
      gainLossPercentage: Number(gainLossPercentage.toFixed(2))
    };

    setStocks(prevStocks => [...prevStocks, newStock]);
    setIsModalOpen(false);
    setFormData({ symbol: '', quantity: 0, purchasePrice: 0 });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add Stock
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <PortfolioTable stocks={stocks} />
      </div>

      {/* Add Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add New Stock</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., AAPL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange(e, 'symbol')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.quantity || ''}
                  onChange={(e) => handleInputChange(e, 'quantity')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price (per share)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => handleInputChange(e, 'purchasePrice')}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}