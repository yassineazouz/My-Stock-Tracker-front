import React from 'react';
import {
  LineChart,
  Bell,
  PlusCircle,
  Settings,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface HelpSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function HelpSection({ title, icon, children }: HelpSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue-600">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-gray-600 space-y-3">{children}</div>
    </div>
  );
}

export function Help() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Help & Documentation</h1>
        </div>
        <p className="text-gray-600">
          Welcome to StockTracker! This guide will help you understand how to use
          all the features of your portfolio tracking application.
        </p>
      </div>

      <div className="space-y-6">
        <HelpSection title="Getting Started" icon={<LineChart className="w-5 h-5" />}>
          <p>
            StockTracker helps you monitor your stock investments in one place.
            Here's how to get started:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Add your stocks using the "Add Stock" button in the Portfolio page</li>
            <li>Track your portfolio's performance in real-time</li>
            <li>Set up price alerts to stay informed about market movements</li>
            <li>Customize your experience through the Settings page</li>
          </ul>
        </HelpSection>

        <HelpSection title="Managing Your Portfolio" icon={<PlusCircle className="w-5 h-5" />}>
          <p className="mb-3">To add a new stock to your portfolio:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Click the "Add Stock" button in the Portfolio page</li>
            <li>Enter the stock symbol (e.g., AAPL for Apple Inc.)</li>
            <li>Specify the number of shares you own</li>
            <li>Enter your purchase price per share</li>
            <li>Click "Add Stock" to save</li>
          </ol>
          <p className="mt-3">
            Your portfolio will automatically calculate your total value, gains/losses,
            and performance metrics.
          </p>
        </HelpSection>

        <HelpSection title="Setting Up Alerts" icon={<Bell className="w-5 h-5" />}>
          <p>Price alerts help you stay informed about market movements:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Navigate to the Alerts page</li>
            <li>Click "New Alert" to create a price alert</li>
            <li>Choose a stock and set your target price</li>
            <li>Select whether to trigger the alert when the price goes above or below your target</li>
            <li>You'll receive notifications when your conditions are met</li>
          </ul>
        </HelpSection>

        <HelpSection title="Understanding Your Dashboard" icon={<TrendingUp className="w-5 h-5" />}>
          <p>Your dashboard provides key insights at a glance:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Total Portfolio Value:</strong> The current value of all your holdings
            </li>
            <li>
              <strong>Performance Metrics:</strong> Overall gains/losses and percentages
            </li>
            <li>
              <strong>Stock Distribution:</strong> Breakdown of your portfolio by sectors
            </li>
            <li>
              <strong>Top Performers:</strong> Your best-performing investments
            </li>
          </ul>
        </HelpSection>

        <HelpSection title="Customizing Settings" icon={<Settings className="w-5 h-5" />}>
          <p>Personalize your StockTracker experience:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Change your preferred currency display</li>
            <li>Adjust the data refresh rate</li>
            <li>Toggle between light and dark themes</li>
            <li>Manage notification preferences</li>
          </ul>
        </HelpSection>

        <HelpSection title="Tips & Best Practices" icon={<HelpCircle className="w-5 h-5" />}>
          <ul className="list-disc pl-6 space-y-2">
            <li>Regularly review your portfolio to ensure data accuracy</li>
            <li>Set realistic price alerts to avoid notification fatigue</li>
            <li>Use the refresh button to get the latest market data</li>
            <li>Keep your purchase prices updated for accurate gain/loss calculations</li>
          </ul>
        </HelpSection>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">Need More Help?</h2>
          </div>
          <p className="text-blue-700">
            This guide covers the basics of using StockTracker. For additional
            support or feature requests, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}