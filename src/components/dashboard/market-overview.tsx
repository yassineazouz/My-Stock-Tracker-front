import { TrendingUp, TrendingDown, RefreshCw, DollarSign, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAllStocks } from '@/lib/api';
import { StockData } from '@/types/stock';
import useSWR from 'swr';

function StockPrice({ value }: { value: string }) {
    return (
        <div className="flex items-baseline gap-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-2xl font-bold tracking-tight">{parseFloat(value).toFixed(2)}</span>
        </div>
    );
}

function PriceChange({ change, percentChange }: { change: string; percentChange: number }) {
    const isPositive = parseFloat(change) >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';

    return (
        <div className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-sm font-medium ${colorClass}`}>
            <Icon className="h-4 w-4" />
            <span>{isPositive ? '+' : ''}{percentChange.toFixed(2)}%</span>
        </div>
    );
}

export function MarketOverview() {
    const { data: stocks, isLoading, mutate } = useSWR<StockData[]>(
        'stocks',
        fetchAllStocks
    );



    const handleRefresh = () => {
        mutate();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Market Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time stock market updates</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading && !stocks ? (
                    Array(7).fill(0).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    stocks?.map((stock) => (
                        <Card key={stock.symbol} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold">{stock.symbol}</CardTitle>
                                    <p className="text-sm text-gray-500 truncate max-w-[180px]">{stock.name}</p>
                                </div>
                                <PriceChange change={stock.change} percentChange={stock.percentChange} />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <StockPrice value={stock.close} />
                                        <p className="text-sm text-gray-500 mt-1">
                                            {parseFloat(stock.change) >= 0 ? '+' : ''}{parseFloat(stock.change).toFixed(2)}$ today
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                                <BarChart3 className="h-4 w-4" />
                                                <span className="text-xs font-medium">Volume</span>
                                            </div>
                                            <p className="text-sm font-medium">
                                                {(parseInt(stock.volume) / 1000000).toFixed(1)}M
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-xs font-medium">Prev Close</span>
                                            </div>
                                            <p className="text-sm font-medium">
                                                ${parseFloat(stock.previousClose).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}