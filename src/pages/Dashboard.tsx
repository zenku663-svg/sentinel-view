import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { SecurityPostureIndicator } from '@/components/dashboard/SecurityPostureIndicator';
import { AlertCounter } from '@/components/dashboard/AlertCounter';
import { AlertsChart } from '@/components/dashboard/AlertsChart';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { RefreshControl } from '@/components/layout/RefreshControl';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { mockSecurityPosture, mockAlertCounts, mockAlerts } from '@/data/mockData';

const Dashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = useCallback(() => {
    // In production, this would fetch data from backend
    setLastUpdate(new Date());
    console.log('Dashboard refreshed');
  }, []);

  const {
    interval,
    setInterval,
    isEnabled,
    toggle,
    lastRefresh,
    isRefreshing,
    refresh,
    countdown,
  } = useAutoRefresh({ defaultInterval: 30, onRefresh: handleRefresh });

  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Security Dashboard" 
        subtitle={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
        rightContent={
          <RefreshControl
            isEnabled={isEnabled}
            interval={interval}
            countdown={countdown}
            isRefreshing={isRefreshing}
            lastRefresh={lastRefresh}
            onToggle={toggle}
            onIntervalChange={setInterval}
            onRefresh={refresh}
          />
        }
      />
      
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Top Section: Posture + Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SecurityPostureIndicator status={mockSecurityPosture} />
          </div>
          <AlertCounter label="Critical" count={mockAlertCounts.critical} severity="critical" delay={1} />
          <AlertCounter label="Alerts" count={mockAlertCounts.alert} severity="alert" delay={2} />
          <AlertCounter label="Warnings" count={mockAlertCounts.warning} severity="warning" delay={3} />
        </div>

        {/* Total Events */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Events (24h)</p>
              <p className="text-3xl font-bold font-mono text-foreground">{mockAlertCounts.total}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Detection Engine</p>
              <p className="text-sm font-semibold text-severity-success">Active</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Chart + Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsChart />
          <RecentAlerts alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
