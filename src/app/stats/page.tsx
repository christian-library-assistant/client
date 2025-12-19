"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import {
  getUsageStats,
  getDailyUsage,
  getTodayUsage,
  UsageStatsData,
  DailyUsageData,
  TodayUsageData,
} from "@/lib/apiService";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Zap,
  RefreshCw,
  Server,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StatsPage() {
  const [usageStats, setUsageStats] = useState<UsageStatsData | null>(null);
  const [dailyUsage, setDailyUsage] = useState<DailyUsageData[]>([]);
  const [todayUsage, setTodayUsage] = useState<TodayUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsResponse, dailyResponse, todayResponse] = await Promise.all([
        getUsageStats(selectedDays),
        getDailyUsage(Math.min(selectedDays, 90)),
        getTodayUsage(),
      ]);
      setUsageStats(statsResponse.data);
      setDailyUsage(dailyResponse.data);
      setTodayUsage(todayResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate max value for chart scaling
  const maxDailyTokens = Math.max(
    ...dailyUsage.map((d) => d.total_tokens),
    1
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero section */}
      <section className="relative py-12 overflow-hidden">
        <BackgroundPattern />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4 relative inline-block">
              <span className="relative z-10">Usage Statistics</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor token usage and API activity for the Smart Library
              Assistant.
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Period:</span>
              {[7, 30, 90].map((days) => (
                <Button
                  key={days}
                  variant={selectedDays === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDays(days)}
                >
                  {days} days
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8 flex-1">
        <div className="container mx-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Today's Stats */}
              {todayUsage && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Today ({todayUsage.date})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      title="Requests"
                      value={formatNumber(todayUsage.requests)}
                      icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <StatCard
                      title="Input Tokens"
                      value={formatNumber(todayUsage.input_tokens)}
                      icon={<BarChart3 className="h-5 w-5" />}
                    />
                    <StatCard
                      title="Output Tokens"
                      value={formatNumber(todayUsage.output_tokens)}
                      icon={<BarChart3 className="h-5 w-5" />}
                    />
                    <StatCard
                      title="Total Tokens"
                      value={formatNumber(todayUsage.total_tokens)}
                      icon={<BarChart3 className="h-5 w-5" />}
                      highlight
                    />
                  </div>
                </div>
              )}

              {/* Period Overview */}
              {usageStats && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedDays}-Day Overview ({usageStats.period.start_date}{" "}
                    to {usageStats.period.end_date})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                      title="Total Requests"
                      value={formatNumber(usageStats.totals.requests)}
                      subtitle={`${usageStats.averages.requests_per_day.toFixed(1)}/day`}
                      icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <StatCard
                      title="Total Tokens"
                      value={formatNumber(usageStats.totals.total_tokens)}
                      subtitle={`${formatNumber(usageStats.averages.tokens_per_day)}/day`}
                      icon={<BarChart3 className="h-5 w-5" />}
                      highlight
                    />
                    <StatCard
                      title="Input Tokens"
                      value={formatNumber(usageStats.totals.input_tokens)}
                      icon={<BarChart3 className="h-5 w-5" />}
                    />
                    <StatCard
                      title="Output Tokens"
                      value={formatNumber(usageStats.totals.output_tokens)}
                      icon={<BarChart3 className="h-5 w-5" />}
                    />
                  </div>

                  {/* By Endpoint */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-card border border-secondary/20 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        By Endpoint
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(usageStats.by_endpoint).map(
                          ([endpoint, stats]) => (
                            <div
                              key={endpoint}
                              className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg"
                            >
                              <div>
                                <span className="font-mono text-sm">
                                  {endpoint}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {stats.requests} requests
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatNumber(
                                    stats.input_tokens + stats.output_tokens
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  tokens
                                </p>
                              </div>
                            </div>
                          )
                        )}
                        {Object.keys(usageStats.by_endpoint).length === 0 && (
                          <p className="text-muted-foreground text-sm">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>

                    {/* By Model */}
                    <div className="bg-card border border-secondary/20 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-primary" />
                        By Model
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(usageStats.by_model).map(
                          ([model, stats]) => (
                            <div
                              key={model}
                              className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg"
                            >
                              <div>
                                <span className="font-mono text-sm">
                                  {model}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {stats.requests} requests
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatNumber(
                                    stats.input_tokens + stats.output_tokens
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  tokens
                                </p>
                              </div>
                            </div>
                          )
                        )}
                        {Object.keys(usageStats.by_model).length === 0 && (
                          <p className="text-muted-foreground text-sm">
                            No data available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Averages */}
                  <div className="bg-card border border-secondary/20 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Averages</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(usageStats.averages.tokens_per_day)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tokens/Day
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {usageStats.averages.requests_per_day.toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requests/Day
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(usageStats.averages.tokens_per_request)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tokens/Request
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Usage Chart */}
              {dailyUsage.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily Token Usage
                  </h2>
                  <div className="bg-card border border-secondary/20 rounded-xl p-6">
                    <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
                      {[...dailyUsage].reverse().map((day) => {
                        const heightPercent =
                          (day.total_tokens / maxDailyTokens) * 100;
                        return (
                          <div
                            key={day.date}
                            className="flex flex-col items-center min-w-[40px] group"
                          >
                            <div className="relative flex-1 w-full flex items-end justify-center">
                              <div
                                className="w-6 bg-primary/80 hover:bg-primary rounded-t transition-all cursor-pointer"
                                style={{
                                  height: `${Math.max(heightPercent, 2)}%`,
                                }}
                                title={`${day.date}: ${day.total_tokens.toLocaleString()} tokens, ${day.requests} requests`}
                              />
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap z-10">
                                <p className="font-semibold">{day.date}</p>
                                <p>
                                  {day.total_tokens.toLocaleString()} tokens
                                </p>
                                <p>{day.requests} requests</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">
                              {formatDate(day.date)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Details Table */}
              {dailyUsage.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Daily Details
                  </h2>
                  <div className="bg-card border border-secondary/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/10">
                          <tr>
                            <th className="text-left p-3 font-semibold">
                              Date
                            </th>
                            <th className="text-right p-3 font-semibold">
                              Requests
                            </th>
                            <th className="text-right p-3 font-semibold">
                              Input
                            </th>
                            <th className="text-right p-3 font-semibold">
                              Output
                            </th>
                            <th className="text-right p-3 font-semibold">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyUsage.slice(0, 14).map((day, index) => (
                            <tr
                              key={day.date}
                              className={
                                index % 2 === 0
                                  ? "bg-secondary/5"
                                  : "bg-transparent"
                              }
                            >
                              <td className="p-3 font-mono">{day.date}</td>
                              <td className="p-3 text-right">{day.requests}</td>
                              <td className="p-3 text-right">
                                {formatNumber(day.input_tokens)}
                              </td>
                              <td className="p-3 text-right">
                                {formatNumber(day.output_tokens)}
                              </td>
                              <td className="p-3 text-right font-semibold">
                                {formatNumber(day.total_tokens)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  highlight,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-card border rounded-xl p-4 ${
        highlight ? "border-primary/50 bg-primary/5" : "border-secondary/20"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
