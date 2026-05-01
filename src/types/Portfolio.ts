import { Stock } from '@/types/Stock';
import { PriceAlert } from '@/types/PriceAlert';

export interface Portfolio {
    id: number;
    owner: string;
    totalValue: number;
    initialInvestment: number;
    stocks: Stock[];
    alerts: PriceAlert[];
    activeAlerts: number;
    performancePercent: number;
    walletValue: number;
}
