import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { AlertsTable } from '@/components/alerts/AlertsTable';
import { mockAlerts, mockAlertCounts } from '@/data/mockData';
import { AlertCounter } from '@/components/dashboard/AlertCounter';
import { RefreshControl } from '@/components/layout/RefreshControl';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const Alerts = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = useCallback(() => {
    // In production, this would fetch data from backend
    setLastUpdate(new Date());
    console.log('Alerts refreshed');
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
        title="Live Alerts" 
        subtitle={`${mockAlertCounts.total} active alerts`}
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
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertCounter label="Critical" count={mockAlertCounts.critical} severity="critical" delay={0} />
          <AlertCounter label="Alerts" count={mockAlertCounts.alert} severity="alert" delay={1} />
          <AlertCounter label="Warnings" count={mockAlertCounts.warning} severity="warning" delay={2} />
        </div>

        {/* Alerts Table */}
        <AlertsTable alerts={mockAlerts} />
      </div>
    </div>
  );
};

export default Alerts;
