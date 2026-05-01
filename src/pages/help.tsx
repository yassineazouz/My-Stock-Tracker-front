import { Bell, BookOpen, LineChart, PlusCircle, RefreshCw, Settings, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/components/ui/page';

const sections = [
  {
    title: 'Getting Started',
    icon: LineChart,
    items: [
      'Add positions from the Portfolio page.',
      'Track portfolio value and market movement from Dashboard.',
      'Use alerts to monitor target prices.',
    ],
  },
  {
    title: 'Managing Portfolio',
    icon: PlusCircle,
    items: [
      'Choose a supported symbol.',
      'Enter quantity and confirm the current market price.',
      'Review total position value after saving.',
    ],
  },
  {
    title: 'Alerts',
    icon: Bell,
    items: [
      'Create target prices for symbols you follow.',
      'Use above or below triggers depending on your strategy.',
      'Keep alerts focused to avoid noise.',
    ],
  },
  {
    title: 'Dashboard',
    icon: TrendingUp,
    items: [
      'Portfolio cards summarize holdings, value, alerts, and top performer.',
      'Market overview shows live quote data for tracked stocks.',
      'Use refresh when you want to request fresh prices.',
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      'Adjust currency and refresh preferences.',
      'Configure notification behavior.',
      'Theme support is ready for a future dark mode pass.',
    ],
  },
  {
    title: 'Data Refresh',
    icon: RefreshCw,
    items: [
      'Market prices depend on the backend and TwelveData key.',
      'Cached quotes are used when available.',
      'Backend errors are shown inline instead of blank screens.',
    ],
  },
];

export function Help() {
  return (
    <Page title="Help" eyebrow="Guide">
      <div className="max-w-5xl">
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">StockTracker basics</h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick reference for the app’s main workflows and data sources.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ title, icon: Icon, items }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="rounded-md bg-slate-100 p-2 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}
