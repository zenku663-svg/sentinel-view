import { RefreshCw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RefreshControlProps {
  isEnabled: boolean;
  interval: number;
  countdown: number;
  isRefreshing: boolean;
  lastRefresh: Date;
  onToggle: () => void;
  onIntervalChange: (value: number) => void;
  onRefresh: () => void;
}

export function RefreshControl({
  isEnabled,
  interval,
  countdown,
  isRefreshing,
  lastRefresh,
  onToggle,
  onIntervalChange,
  onRefresh,
}: RefreshControlProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Last refresh time */}
      <span className="text-xs text-muted-foreground hidden sm:block">
        Last: {lastRefresh.toLocaleTimeString()}
      </span>

      {/* Countdown indicator */}
      {isEnabled && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-mono">{countdown}s</span>
        </div>
      )}

      {/* Interval selector */}
      <Select 
        value={interval.toString()} 
        onValueChange={(v) => onIntervalChange(Number(v))}
      >
        <SelectTrigger className="w-[100px] h-8 text-xs bg-secondary/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 sec</SelectItem>
          <SelectItem value="30">30 sec</SelectItem>
          <SelectItem value="60">1 min</SelectItem>
          <SelectItem value="300">5 min</SelectItem>
        </SelectContent>
      </Select>

      {/* Play/Pause toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggle}
          >
            {isEnabled ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isEnabled ? 'Pause auto-refresh' : 'Resume auto-refresh'}
        </TooltipContent>
      </Tooltip>

      {/* Manual refresh button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh now</TooltipContent>
      </Tooltip>
    </div>
  );
}
