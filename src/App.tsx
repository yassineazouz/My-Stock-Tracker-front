import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { Bell, HelpCircle, LayoutDashboard, LineChart, Settings, Wallet } from 'lucide-react';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary';
import { Notice, Page } from '@/components/ui/page';
import { Alerts } from '@/pages/alerts';
import { Help } from '@/pages/help';
import { Portfolio } from '@/pages/portfolio';
import { Settings as SettingsPage } from '@/pages/settings';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/lib/format';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: LineChart, label: 'Portfolio', path: '/portfolio' },
  { icon: Bell, label: 'Alerts', path: '/alerts' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950 px-4 py-5 text-white lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
          <LineChart className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">StockTracker</p>
          <p className="text-xs text-slate-400">Portfolio workspace</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
      <div className="mb-2 flex items-center gap-2 px-1">
        <LineChart className="h-5 w-5 text-emerald-600" />
        <span className="font-bold">StockTracker</span>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-slate-950 text-white' : 'text-slate-600'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Dashboard() {
  const { data: portfolioData, error, isLoading } = usePortfolio();

  return (
    <Page
      title="Dashboard"
      eyebrow="Overview"
      actions={
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Wallet className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-950">
            {formatCurrency(portfolioData?.walletValue)}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {error && (
          <Notice tone="danger">
            Backend is not returning the portfolio. Check the API URL and backend port.
          </Notice>
        )}

        {isLoading && <Notice>Loading portfolio data...</Notice>}

        <PortfolioSummary portfolioData={portfolioData} />
        <MarketOverview />
      </div>
    </Page>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <MobileNav />
        <div className="lg:pl-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
