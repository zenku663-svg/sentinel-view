import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { time: '00:00', critical: 2, alert: 5, warning: 8 },
  { time: '04:00', critical: 1, alert: 3, warning: 12 },
  { time: '08:00', critical: 4, alert: 8, warning: 15 },
  { time: '12:00', critical: 3, alert: 12, warning: 20 },
  { time: '16:00', critical: 5, alert: 9, warning: 18 },
  { time: '20:00', critical: 2, alert: 6, warning: 10 },
];

const chartConfig = {
  critical: {
    label: 'Critical',
    color: 'hsl(0, 72%, 51%)',
  },
  alert: {
    label: 'Alert',
    color: 'hsl(25, 95%, 53%)',
  },
  warning: {
    label: 'Warning',
    color: 'hsl(48, 96%, 53%)',
  },
};

export function AlertsChart() {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Alerts Over Time (24h)</h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
          <XAxis 
            dataKey="time" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="critical" stackId="a" fill="var(--color-critical)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="alert" stackId="a" fill="var(--color-alert)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="warning" stackId="a" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-severity-critical" />
          <span className="text-xs text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-severity-alert" />
          <span className="text-xs text-muted-foreground">Alert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-severity-warning" />
          <span className="text-xs text-muted-foreground">Warning</span>
        </div>
      </div>
    </div>
  );
}
