import useSWR from 'swr';
import { getPortfolioData } from '@/lib/api';
import { Portfolio } from '@/types/Portfolio';

export function usePortfolio() {
    return useSWR<Portfolio>('portfolioData', getPortfolioData);
}
