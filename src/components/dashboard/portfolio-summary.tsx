import { Award, Bell, DollarSign, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTopStock } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Portfolio } from '@/types/Portfolio';
import { StockData } from '@/types/stock-data';

type Props = {
  portfolioData?: Portfolio;
};

function MetricCard({
  title,
  value,
  caption,
  icon: Icon,
  tone = 'neutral',
}: {
  title: string;
  value: string | number;
  caption: string;
  icon: typeof DollarSign;
  tone?: 'neutral' | 'good' | 'bad';
}) {
  const toneClass = {
    neutral: 'text-slate-500',
    good: 'text-emerald-600',
    bad: 'text-rose-600',
  }[tone];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="rounded-md bg-slate-100 p-2 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-950">{value}</div>
        <p className={`mt-1 text-xs ${toneClass}`}>{caption}</p>
      </CardContent>
    </Card>
  );
}

export function PortfolioSummary({ portfolioData }: Props) {
  const { data: stock, error, isLoading } = useSWR<StockData>('stock', getTopStock);

  const totalValue = portfolioData?.totalValue ?? 0;
  const performancePercent = portfolioData?.performancePercent ?? 0;
  const stockCount = portfolioData?.stocks?.length ?? 0;
  const activeAlerts = portfolioData?.activeAlerts ?? 0;
  const performanceTone = performancePercent >= 0 ? 'good' : 'bad';

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Portfolio Value"
        value={formatCurrency(totalValue)}
        caption={`${formatPercent(performancePercent)} from initial investment`}
        icon={DollarSign}
        tone={performanceTone}
      />
      <MetricCard
        title="Holdings"
        value={stockCount}
        caption={stockCount === 1 ? '1 active position' : `${stockCount} active positions`}
        icon={TrendingUp}
      />
      <MetricCard
        title="Active Alerts"
        value={activeAlerts}
        caption="Price thresholds configured"
        icon={Bell}
      />
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">Top Performer</CardTitle>
          <div className="rounded-md bg-slate-100 p-2 text-slate-500">
            <Award className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
          ) : error || !stock ? (
            <p className="text-sm font-medium text-rose-600">Unavailable</p>
          ) : (
            <>
              <div className="truncate text-sm font-medium text-slate-700">
                {stock.name} ({stock.symbol})
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {formatPercent(stock.percentChange)}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
