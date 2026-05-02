import useSWR from 'swr';
import { getCurrentUsername, getPortfolioData } from '@/lib/api';
import { Portfolio } from '@/types/Portfolio';

export function usePortfolio() {
    return useSWR<Portfolio>(['portfolioData', getCurrentUsername()], () => getPortfolioData());
}
