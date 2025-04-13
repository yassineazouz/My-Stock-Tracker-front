import {StockData} from '@/types/stock';
import {Portfolio} from "@/types/Portfolio.ts";
import {Stock} from "@/components/portfolio/portfolio-table.tsx";

const API_URL = 'http://localhost:8080/api';

export async function getTopStock(): Promise<StockData> {
    const response = await fetch(API_URL + '/stocks/top-performer');

    if (!response.ok) {
        throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();
    console.log('Top stock data:', data); // 👈 Now you’ll see the real data
    data.changePercent = parseFloat(data.changePercent);

    return data;
}


export async function fetchAllStocks(): Promise<StockData[]> {
    const response = await fetch(API_URL + '/stocks/all');
    if (!response.ok) {
        throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();
    const mapped = data.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        close: parseFloat(stock.close),
        previousClose: parseFloat(stock.previousClose),
        change: parseFloat(stock.change),
        percentChange: parseFloat(stock.percentChange),
        volume: parseInt(stock.volume),
    }));

    return mapped;
}


export async function getPortfolioData(): Promise<Portfolio> {
    const response = await fetch(API_URL + '/user/yassine');

    if (!response.ok) {
        throw new Error('Failed to fetch stock data');
    }
    const data = await response.json();
    return data;
}


export async function buyStock(username: string, stock: Stock): Promise<Stock> {
    const response = await fetch(API_URL + `/user/stock/${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
    });

    if (!response.ok) {
        throw new Error("Failed to buy stock");
    }

    return await response.json();
}

