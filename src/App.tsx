import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LayoutDashboard, LineChart, Bell, Settings, HelpCircle, Wallet} from 'lucide-react';
import { PortfolioSummary } from './components/dashboard/portfolio-summary';
import { MarketOverview } from './components/dashboard/market-overview';
import { Portfolio } from './pages/portfolio';
import { Alerts } from './pages/alerts';
import { Settings as SettingsPage } from './pages/settings';
import { Help } from './pages/help';
import useSWR from "swr";
import {getPortfolioData} from "@/lib/api.ts";
import {Portfolio as PortfolioEntity} from "@/types/Portfolio.ts";

function Sidebar() {
    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4">
            <div className="flex items-center gap-2 mb-8">
                <LineChart className="h-8 w-8" />
                <span className="text-xl font-bold">StockTracker</span>
            </div>
            <nav className="space-y-2">
                {[
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                    { icon: LineChart, label: 'Portfolio', path: '/portfolio' },
                    { icon: Bell, label: 'Alerts', path: '/alerts' },
                    { icon: Settings, label: 'Settings', path: '/settings' },
                    { icon: HelpCircle, label: 'Help', path: '/help' },
                ].map(({ icon: Icon, label, path }) => (
                    <a
                        key={path}
                        href={path}
                        className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
}

function Dashboard() {

    const {data: portfolioData} = useSWR<PortfolioEntity>(
        'portfolioData',
        getPortfolioData
    );
    return (
        <div className="p-8">
            {/* Top row: title on left, wallet on right */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                {/* Small Wallet Card on Right */}
                <div className="flex items-center gap-2 bg-white shadow-md rounded-xl px-4 py-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="text-right">
                        <p className="text-lg font-semibold">${portfolioData?.walletValue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Dashboard sections */}
            <div className="space-y-8">
                <PortfolioSummary portfolioData={portfolioData} />
                <MarketOverview />
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Sidebar />
                <div className="ml-64">
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