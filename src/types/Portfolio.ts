import { Stock } from '@/types/Stock';

export interface Portfolio {
    id: number;
    owner: string;
    totalValue: number;
    initialInvestment: number;
    stocks: Stock[];
    activeAlerts: number;
    performancePercent: number;
    walletValue: number;
}
