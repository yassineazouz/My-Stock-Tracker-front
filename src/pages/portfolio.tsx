import React, { useState, useEffect } from 'react';
import { PortfolioTable } from '@/components/portfolio/portfolio-table';
import { Stock } from '@/types/Stock';
import { Plus, Wallet, X } from 'lucide-react';
import useSWR from 'swr';
import { usePortfolio } from '@/hooks/usePortfolio';
import { buyStock, fetchAllStocks } from '@/lib/api';
import { StockData } from '@/types/stock-data';

interface StockFormData {
    symbol: string;
    quantity: number;
    purchasePrice: number;
}

const AVAILABLE_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
];

export function Portfolio() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [formData, setFormData] = useState<StockFormData>({
        symbol: '',
        quantity: 0,
        purchasePrice: 0,
    });
    const [totalValue, setTotalValue] = useState(0);

    const username = 'yassine';

    const { data: portfolioData, mutate } = usePortfolio();
    const { data: marketData } = useSWR<StockData[]>('stocks', fetchAllStocks);

    const livePrice = (symbol: string): number =>
        marketData?.find((s) => s.symbol === symbol)?.close ?? 0;

    useEffect(() => {
        if (portfolioData?.stocks) {
            setStocks(portfolioData.stocks);
        }
    }, [portfolioData]);

    useEffect(() => {
        if (formData.symbol && formData.quantity) {
            const currentPrice = livePrice(formData.symbol);
            setTotalValue(currentPrice * formData.quantity);
            setFormData(prev => ({ ...prev, purchasePrice: currentPrice }));
        }
    }, [formData.symbol, formData.quantity, marketData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof StockFormData
    ) => {
        const value = e.target.value;
        switch (field) {
            case 'symbol':
                setFormData(prev => ({ ...prev, symbol: value }));
                break;
            case 'quantity':
                setFormData(prev => ({ ...prev, quantity: Math.max(0, parseInt(value) || 0) }));
                break;
            case 'purchasePrice':
                setFormData(prev => ({ ...prev, purchasePrice: Math.max(0, parseFloat(value) || 0) }));
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.symbol || formData.quantity <= 0) {
            alert('Please fill in all fields with valid values');
            return;
        }

        const currentPrice = livePrice(formData.symbol);
        const cost = formData.purchasePrice * formData.quantity;
        const gainLoss = currentPrice * formData.quantity - cost;
        const gainLossPercentage = cost > 0 ? (gainLoss / cost) * 100 : 0;
        const selectedStock = AVAILABLE_STOCKS.find(s => s.symbol === formData.symbol);

        const newStock: Stock = {
            symbol: formData.symbol,
            companyName: selectedStock?.name ?? `${formData.symbol} Inc.`,
            quantity: formData.quantity,
            purchasePrice: formData.purchasePrice,
            currentPrice,
            totalValue: Number((currentPrice * formData.quantity).toFixed(2)),
            gainLoss: Number(gainLoss.toFixed(2)),
            gainLossPercentage: Number(gainLossPercentage.toFixed(2)),
        };

        try {
            await buyStock(username, newStock);
            setIsModalOpen(false);
            setFormData({ symbol: '', quantity: 0, purchasePrice: 0 });
            setTotalValue(0);
            mutate();
        } catch (error) {
            console.error('Error buying stock:', error);
            alert('Failed to buy stock. Please try again.');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <div className="flex items-center gap-2 bg-white shadow-md rounded-xl px-4 py-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="text-right">
                        <p className="text-lg font-semibold">{portfolioData?.walletValue} $</p>
                    </div>
                </div>
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
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.symbol}
                                    onChange={(e) => handleInputChange(e, 'symbol')}
                                >
                                    <option value="">Select a stock</option>
                                    {AVAILABLE_STOCKS.map((stock) => (
                                        <option key={stock.symbol} value={stock.symbol}>
                                            {stock.symbol} - {stock.name}
                                        </option>
                                    ))}
                                </select>
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
                                    Current Market Price (per share)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        readOnly
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                                        value={formData.purchasePrice.toFixed(2)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Value
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        readOnly
                                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                                        value={totalValue.toFixed(2)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setFormData({ symbol: '', quantity: 0, purchasePrice: 0 });
                                        setTotalValue(0);
                                    }}
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
