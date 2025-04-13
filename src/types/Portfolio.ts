import {Stock} from "@/components/portfolio/portfolio-table.tsx";

export interface Portfolio {
    id: number;
    owner: string;
    totalValue: number;
    initialInvestment: number;
    stocks: Stock[];
    activeAlerts: number;
    performancePercent: number;
    walletValue : number

}