'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SmartCoachInsight, WeatherData, SoilData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SmartCoachProps {
  insights: SmartCoachInsight[]
  weather: WeatherData[]
  soil?: SoilData
}

export function SmartCoach({ insights, weather, soil }: SmartCoachProps) {
  const getInsightIcon = (type: SmartCoachInsight['type']) => {
    switch (type) {
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )
      case 'suggestion':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
    }
  }

  const getPriorityColor = (priority: SmartCoachInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive'
      case 'medium':
        return 'bg-warning/10 text-warning-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const totalRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0)
  const avgTemp = weather.reduce((sum, w) => sum + w.temperature, 0) / weather.length
  const avgHumidity = weather.reduce((sum, w) => sum + w.humidity, 0) / weather.length

  return (
    <div className="flex flex-col gap-6">
      {/* Weather Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
            7-Day Weather Summary
          </CardTitle>
          <CardDescription>Local weather conditions from the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">{totalRainfall.toFixed(1)}mm</p>
              <p className="text-xs text-muted-foreground mt-1">Total Rainfall</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{avgTemp.toFixed(1)}°C</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Temperature</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{avgHumidity.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Humidity</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">{weather.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Days Tracked</p>
            </div>
          </div>

          {/* Weather Timeline */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {weather.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-card border min-w-20">
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span className="text-xs">{day.rainfall}mm</span>
                  </div>
                  <p className="text-sm font-medium">{day.temperature}°C</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soil Data */}
      {soil && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M2 22h20" />
                <path d="M6.36 17.64 4 20" />
                <path d="m12 19-1.17-1.17" />
                <path d="M18 13l2 2" />
                <path d="M12 13v-3" />
                <path d="M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
              Soil Analysis
            </CardTitle>
            <CardDescription>Current soil conditions at harvest location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{soil.ph}</p>
                <p className="text-xs text-muted-foreground mt-1">pH Level</p>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'mt-2 text-xs',
                    soil.ph >= 6 && soil.ph <= 7 ? 'bg-success/10 text-success' : 'bg-warning/10'
                  )}
                >
                  {soil.ph >= 6 && soil.ph <= 7 ? 'Optimal' : 'Check'}
                </Badge>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{soil.moisture}%</p>
                <p className="text-xs text-muted-foreground mt-1">Moisture</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{soil.nitrogen}</p>
                <p className="text-xs text-muted-foreground mt-1">N (mg/kg)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{soil.phosphorus}</p>
                <p className="text-xs text-muted-foreground mt-1">P (mg/kg)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{soil.potassium}</p>
                <p className="text-xs text-muted-foreground mt-1">K (mg/kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Coach Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 12 20 4" />
              <path d="m15 4 5 0 0 5" />
            </svg>
            Smart Coach Insights
          </CardTitle>
          <CardDescription>AI-generated recommendations based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-muted-foreground">No issues detected. Your conditions look good!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-lg border',
                    insight.priority === 'high' && 'border-destructive/30 bg-destructive/5'
                  )}
                >
                  <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="secondary" className={cn('text-xs', getPriorityColor(insight.priority))}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
