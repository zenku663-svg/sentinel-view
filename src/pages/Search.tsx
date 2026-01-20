import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, AlertTriangle, FileText, Clock } from 'lucide-react';
import { mockAlerts, mockLogs } from '@/data/mockData';
import { SeverityBadge } from '@/components/alerts/SeverityBadge';
import { cn } from '@/lib/utils';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'logs'>('all');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { alerts: [], logs: [] };

    const q = query.toLowerCase();

    const alerts = mockAlerts.filter(alert => 
      alert.reason.toLowerCase().includes(q) ||
      alert.detectionType.toLowerCase().includes(q) ||
      alert.user?.toLowerCase().includes(q) ||
      alert.service?.toLowerCase().includes(q) ||
      alert.sourceIp?.toLowerCase().includes(q) ||
      alert.rawLog?.toLowerCase().includes(q)
    );

    const logs = mockLogs.filter(log =>
      log.message.toLowerCase().includes(q) ||
      log.service.toLowerCase().includes(q) ||
      log.user?.toLowerCase().includes(q) ||
      log.ip?.toLowerCase().includes(q)
    );

    return { alerts, logs };
  }, [query]);

  const totalResults = searchResults.alerts.length + searchResults.logs.length;

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
        title="Search" 
        subtitle="Search across all alerts and logs"
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Search Bar */}
        <div className="stat-card">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search alerts, logs, users, IPs, services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-secondary/50 border-border"
            />
          </div>
          {query && (
            <p className="mt-3 text-sm text-muted-foreground">
              Found <span className="text-foreground font-semibold">{totalResults}</span> results for "{query}"
            </p>
          )}
        </div>

        {/* Results */}
        {query && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="bg-secondary/50 border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alerts ({searchResults.alerts.length})
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Logs ({searchResults.logs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              {/* Alerts Section */}
              {searchResults.alerts.length > 0 && (
                <div className="stat-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerts ({searchResults.alerts.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.alerts.slice(0, 5).map(alert => (
                      <div key={alert.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-3 mb-2">
                          <SeverityBadge severity={alert.severity} />
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs text-accent-foreground bg-accent/20 px-2 py-0.5 rounded">
                            {alert.detectionType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{alert.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logs Section */}
              {searchResults.logs.length > 0 && (
                <div className="stat-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Logs ({searchResults.logs.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.logs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50 font-mono text-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-muted-foreground">
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
                        </div>
                        <p className="text-sm text-muted-foreground break-all">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="stat-card text-center py-12">
                  <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="mt-4">
              <div className="stat-card">
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {searchResults.alerts.map(alert => (
                    <div key={alert.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-3 mb-2">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <span className="text-xs text-accent-foreground bg-accent/20 px-2 py-0.5 rounded">
                          {alert.detectionType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{alert.reason}</p>
                      {alert.rawLog && (
                        <pre className="mt-2 p-2 bg-background/50 rounded text-xs text-muted-foreground overflow-x-auto">
                          {alert.rawLog}
                        </pre>
                      )}
                    </div>
                  ))}
                  {searchResults.alerts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No alerts found
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="stat-card">
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {searchResults.logs.map(log => (
                    <div key={log.id} className="p-3 rounded-lg bg-secondary/30 border border-border/50 font-mono text-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-muted-foreground">
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
                          <span className="text-xs text-muted-foreground">user: {log.user}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground break-all">{log.message}</p>
                    </div>
                  ))}
                  {searchResults.logs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No logs found
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {!query && (
          <div className="stat-card text-center py-16">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Search Everything</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Search across all alerts and logs. Find events by user, IP address, service name, or any keyword in the log message.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Recent searches
              </span>
              <span>•</span>
              <span>Try: "admin", "ssh", "192.168"</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
