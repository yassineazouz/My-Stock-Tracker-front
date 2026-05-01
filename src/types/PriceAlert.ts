export type AlertDirection = 'ABOVE' | 'BELOW';

export interface PriceAlert {
  id: number;
  symbol: string;
  companyName: string;
  targetPrice: number;
  currentPrice: number;
  direction: AlertDirection;
  active: boolean;
  createdAt: string;
}

export interface PriceAlertRequest {
  symbol: string;
  companyName?: string;
  targetPrice: number;
  direction: AlertDirection;
}
