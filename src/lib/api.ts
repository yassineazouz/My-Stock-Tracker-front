import { StockData } from '@/types/stock-data';
import { Stock } from '@/types/Stock';
import { Portfolio } from '@/types/Portfolio';
import { PriceAlert, PriceAlertRequest } from '@/types/PriceAlert';
import { AuthUser, LoginRequest, SignupRequest } from '@/types/Auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
const AUTH_STORAGE_KEY = 'stock-tracker-user';

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
        let errorMessage = `${message} (${response.status})`;
        try {
            const body = await response.json();
            if (body?.message) {
                errorMessage = body.message;
            }
        } catch {
            // Keep the generic message when the backend did not return JSON.
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export function getStoredUser(): AuthUser | null {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
}

export function storeUser(user: AuthUser) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getCurrentUsername() {
    return getStoredUser()?.username ?? 'yassine';
}

export async function login(request: LoginRequest): Promise<AuthUser> {
    const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    return parseJsonResponse<AuthUser>(response, 'Failed to login');
}

export async function signup(request: SignupRequest): Promise<AuthUser> {
    const response = await fetch(API_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    return parseJsonResponse<AuthUser>(response, 'Failed to sign up');
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
    const response = await fetch(API_URL + `/user/${getCurrentUsername()}`);
    return parseJsonResponse<Portfolio>(response, 'Failed to fetch portfolio data');
}


export interface BuyStockRequest {
    symbol: string;
    companyName: string;
    quantity: number;
}

export async function buyStock(username: string, request: BuyStockRequest): Promise<Stock> {
    const response = await fetch(API_URL + `/user/stock/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return parseJsonResponse<Stock>(response, 'Failed to buy stock');
}

export async function sellStock(stockId: number, username = getCurrentUsername()): Promise<void> {
    const response = await fetch(API_URL + `/user/${username}/stocks/${stockId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        let errorMessage = `Failed to sell stock (${response.status})`;
        try {
            const body = await response.json();
            if (body?.message) errorMessage = body.message;
        } catch { /* no body */ }
        throw new Error(errorMessage);
    }
}

export async function fetchAlerts(username = getCurrentUsername()): Promise<PriceAlert[]> {
    const response = await fetch(API_URL + `/alerts/${username}`);
    return parseJsonResponse<PriceAlert[]>(response, 'Failed to fetch alerts');
}

export async function createAlert(alert: PriceAlertRequest, username = getCurrentUsername()): Promise<PriceAlert> {
    const response = await fetch(API_URL + `/alerts/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
    });

    return parseJsonResponse<PriceAlert>(response, 'Failed to create alert');
}

export async function deleteAlert(alertId: number, username = getCurrentUsername()): Promise<void> {
    const response = await fetch(API_URL + `/alerts/${username}/${alertId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete alert (${response.status})`);
    }
}

export async function checkAlertsNow(): Promise<PriceAlert[]> {
    const response = await fetch(API_URL + '/alerts/check', {
        method: 'POST',
    });

    return parseJsonResponse<PriceAlert[]>(response, 'Failed to check alerts');
}
