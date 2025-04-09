import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, LineChart, Bell, Settings, HelpCircle } from 'lucide-react';
import { PortfolioSummary } from './components/dashboard/portfolio-summary';
import { Portfolio } from './pages/portfolio';
import { Alerts } from './pages/alerts';
import { Settings as SettingsPage } from './pages/settings';
import { Help } from './pages/help';

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
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <PortfolioSummary />
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