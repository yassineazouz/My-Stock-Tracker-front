import { StockData } from '@/types/stock-data';
import { Stock } from '@/types/Stock';
import { Portfolio } from '@/types/Portfolio';
import { PriceAlert, PriceAlertRequest } from '@/types/PriceAlert';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

type StockQuoteResponse = {
    symbol: string;
    name: string;
    close: string | number;
    previousClose: string | number;
    change: string | number;
    percentChange: string | number;
    volume: string | number;
};

async function parseJsonResponse<T>(response: Response, message: string): Promise<T> {
    if (!response.ok) {
        throw new Error(`${message} (${response.status})`);
    }

    return response.json();
}

export async function getTopStock(): Promise<StockData> {
    const response = await fetch(API_URL + '/stocks/top-performer');
    return parseJsonResponse<StockData>(response, 'Failed to fetch top stock');
}


export async function fetchAllStocks(): Promise<StockData[]> {
    const response = await fetch(API_URL + '/stocks/all');
    const data = await parseJsonResponse<StockQuoteResponse[]>(response, 'Failed to fetch stock data');
    const mapped = data.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        close: Number(stock.close),
        previousClose: Number(stock.previousClose),
        change: Number(stock.change),
        percentChange: Number(stock.percentChange),
        volume: Number(stock.volume),
    }));

    return mapped;
}


export async function getPortfolioData(): Promise<Portfolio> {
    const response = await fetch(API_URL + '/user/yassine');
    return parseJsonResponse<Portfolio>(response, 'Failed to fetch portfolio data');
}


export async function buyStock(username: string, stock: Stock): Promise<Stock> {
    const response = await fetch(API_URL + `/user/stock/${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
    });

    return parseJsonResponse<Stock>(response, 'Failed to buy stock');
}

export async function fetchAlerts(username = 'yassine'): Promise<PriceAlert[]> {
    const response = await fetch(API_URL + `/alerts/${username}`);
    return parseJsonResponse<PriceAlert[]>(response, 'Failed to fetch alerts');
}

export async function createAlert(alert: PriceAlertRequest, username = 'yassine'): Promise<PriceAlert> {
    const response = await fetch(API_URL + `/alerts/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
    });

    return parseJsonResponse<PriceAlert>(response, 'Failed to create alert');
}

export async function deleteAlert(alertId: number, username = 'yassine'): Promise<void> {
    const response = await fetch(API_URL + `/alerts/${username}/${alertId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete alert (${response.status})`);
    }
}
