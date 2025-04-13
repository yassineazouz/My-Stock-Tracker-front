import {TrendingUp, DollarSign, Bell, Award} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import useSWR from "swr";
import {StockData} from "@/types/stock";
import { getTopStock} from "@/lib/api";
import {Portfolio} from "@/types/Portfolio.ts";

type Props = {
    portfolioData?: Portfolio;
};

export function PortfolioSummary({ portfolioData }: Props) {
    const {data: stock, error, isLoading} = useSWR<StockData>(
        'stock',
        getTopStock
    );
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${portfolioData?.totalValue}</div>
                    <p
                        className={`text-xs ${
                            portfolioData?.performancePercent ?? 0 >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {portfolioData?.performancePercent.toFixed(2)}% from initial investment
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Number of Stocks</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{portfolioData?.stocks.length}</div>
                    <p className="text-xs text-muted-foreground">Across 1 sectors</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{portfolioData?.activeAlerts}</div>
                    <p className="text-xs text-muted-foreground">Price thresholds set</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : error || !stock ? (
                        <p className="text-sm text-red-500">Failed to load</p>
                    ) : (
                        <>
                            <p className="text-sm">{stock.name} ({stock.symbol})</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stock.percentChange.toFixed(2)}%
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
