'use client';

import { useState } from 'react';
import { Period, RevenueTab, getRevenueData, formatCurrency } from '@/lib/revenue-data';

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>('monthly');
  const [activeTab, setActiveTab] = useState<RevenueTab>('gross');

  const revenueData = getRevenueData(period);

  const tabs: { id: RevenueTab; label: string }[] = [
    { id: 'gross', label: 'Gross Revenue' },
    { id: 'expenses', label: 'Total Expenses' },
    { id: 'net', label: 'Net Revenue' },
  ];

  const getTabValue = (): number => {
    switch (activeTab) {
      case 'gross':
        return revenueData.grossRevenue;
      case 'expenses':
        return revenueData.totalExpenses;
      case 'net':
        return revenueData.netRevenue;
      default:
        return 0;
    }
  };

  const getInfoContent = () => {
    switch (activeTab) {
      case 'gross':
        return (
          <>
            <p className="text-foreground font-medium">
              Duration: {revenueData.duration}
            </p>
            {revenueData.revenueGenerated && (
              <p className="text-foreground font-medium">
                Revenue Generated: {formatCurrency(revenueData.revenueGenerated)}
              </p>
            )}
            {revenueData.totalOrders && (
              <p className="text-foreground font-medium">
                Total Orders: {revenueData.totalOrders}
              </p>
            )}
          </>
        );
      case 'expenses':
        return (
          <>
            <p className="text-foreground font-medium">
              Duration: {revenueData.duration}
            </p>
            {revenueData.expensesPaid && (
              <p className="text-foreground font-medium">
                Expenses Paid: {formatCurrency(revenueData.expensesPaid)}
              </p>
            )}
          </>
        );
      case 'net':
        return (
          <>
            <p className="text-foreground font-medium">
              Duration: {revenueData.duration}
            </p>
            <p className="text-foreground font-medium">
              Net Revenue: {formatCurrency(revenueData.netRevenue)}
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Finance</h1>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none transition-opacity"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:opacity-90'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Value Display */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              {activeTab === 'gross'
                ? 'Gross Revenue'
                : activeTab === 'expenses'
                  ? 'Total Expenses'
                  : 'Net Revenue'}
            </p>
            <p className="text-5xl md:text-6xl font-bold text-primary">
              {formatCurrency(getTabValue())}
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-secondary rounded-lg p-6 border border-border space-y-3">
          {getInfoContent()}
        </div>

        {/* Top Performers - Only show for monthly and yearly */}
        {(period === 'monthly' || period === 'yearly') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Vendor */}
            {revenueData.topVendor && (
              <div className="bg-secondary rounded-lg p-6 border border-border space-y-4">
                <h3 className="text-lg font-bold text-foreground">Top Vendor</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={revenueData.topVendor.avatar}
                    alt={revenueData.topVendor.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {revenueData.topVendor.name}
                    </p>
                    {revenueData.topVendor.location && (
                      <p className="text-sm text-muted-foreground">
                        {revenueData.topVendor.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center">
                  <p className="text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(revenueData.topVendor.revenue)}
                  </p>
                </div>
              </div>
            )}

            {/* Top Rider */}
            {revenueData.topRider && (
              <div className="bg-secondary rounded-lg p-6 border border-border space-y-4">
                <h3 className="text-lg font-bold text-foreground">Top Rider</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={revenueData.topRider.avatar}
                    alt={revenueData.topRider.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {revenueData.topRider.name}
                    </p>
                    {revenueData.topRider.type && (
                      <p className="text-sm text-muted-foreground">
                        {revenueData.topRider.type}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-4 text-center">
                  <p className="text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(revenueData.topRider.revenue)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
