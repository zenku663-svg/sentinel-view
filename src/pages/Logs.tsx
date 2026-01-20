import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar } from 'lucide-react';
import { mockLogs } from '@/data/mockData';
import { cn } from '@/lib/utils';

type LogSource = 'all' | 'syslog' | 'auth' | 'suricata';

const Logs = () => {
  const [activeTab, setActiveTab] = useState<LogSource>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1h');

  // Get unique services for filter
  const services = useMemo(() => {
    const uniqueServices = [...new Set(mockLogs.map(log => log.service))];
    return uniqueServices;
  }, []);

  // Filter logs based on active tab, search, and filters
  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      // Tab filter
      if (activeTab !== 'all' && log.source !== activeTab) return false;
      
      // Service filter
      if (serviceFilter !== 'all' && log.service !== serviceFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.message.toLowerCase().includes(query) ||
          log.service.toLowerCase().includes(query) ||
          log.user?.toLowerCase().includes(query) ||
          log.ip?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [activeTab, searchQuery, serviceFilter]);

  const getSeverityClass = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-severity-critical';
      case 'WARNING': return 'text-severity-warning';
      case 'ALERT': return 'text-severity-alert';
      default: return 'text-muted-foreground';
    }
  };

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'auth': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'syslog': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suricata': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header 
        title="Logs Viewer" 
        subtitle="View and filter logs from all sources"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Filters Bar */}
        <div className="stat-card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by message, service, user, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border"
              />
            </div>
            <div className="flex gap-3">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[160px] bg-secondary/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] bg-secondary/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">Last 15 min</SelectItem>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LogSource)} className="w-full">
          <TabsList className="bg-secondary/50 border border-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Logs ({mockLogs.length})
            </TabsTrigger>
            <TabsTrigger value="syslog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Syslog ({mockLogs.filter(l => l.source === 'syslog').length})
            </TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Auth Log ({mockLogs.filter(l => l.source === 'auth').length})
            </TabsTrigger>
            <TabsTrigger value="suricata" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Suricata ({mockLogs.filter(l => l.source === 'suricata').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {filteredLogs.length} logs found
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  Showing {activeTab === 'all' ? 'all sources' : activeTab}
                </span>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                {filteredLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-border transition-colors font-mono text-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium border',
                        getSourceBadgeClass(log.source)
                      )}>
                        {log.source}
                      </span>
                      <span className="text-xs text-accent-foreground bg-accent/20 px-2 py-0.5 rounded">
                        {log.service}
                      </span>
                      {log.user && (
                        <span className="text-xs text-muted-foreground">
                          user: <span className="text-foreground">{log.user}</span>
                        </span>
                      )}
                      {log.ip && (
                        <span className="text-xs text-muted-foreground">
                          ip: <span className="text-foreground">{log.ip}</span>
                        </span>
                      )}
                    </div>
                    <p className={cn('mt-2 text-sm break-all', getSeverityClass(log.severity))}>
                      {log.message}
                    </p>
                  </div>
                ))}
                
                {filteredLogs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No logs found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Logs;
