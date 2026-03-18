'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { generateMockPassports, generateWeatherData } from '@/lib/mock-data'
import { GRADE_INFO, CropGrade, DigitalPassport, WeatherData } from '@/lib/types'
import { cn } from '@/lib/utils'

function DashboardContent() {
  const [passports] = React.useState<DigitalPassport[]>(() => generateMockPassports(5))
  const [weather] = React.useState<WeatherData[]>(() => generateWeatherData())

  const stats = {
    totalHarvests: passports.length,
    verified: passports.filter(p => p.verificationStatus === 'verified').length,
    pending: passports.filter(p => p.verificationStatus === 'pending').length,
    avgGrade: passports.reduce((acc, p) => {
      const gradeValues: Record<CropGrade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 }
      return acc + gradeValues[p.grade]
    }, 0) / passports.length
  }

  const getGradeLetter = (avg: number): CropGrade => {
    if (avg >= 4.5) return 'A'
    if (avg >= 3.5) return 'B'
    if (avg >= 2.5) return 'C'
    if (avg >= 1.5) return 'D'
    return 'E'
  }

  const totalRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Welcome to AgriIntel</h1>
          <p className="text-muted-foreground mt-2 text-pretty max-w-2xl">
            Your smart agricultural intelligence platform for crop grading, quality verification, and data-driven insights.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/grade" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Grade New Harvest</h3>
                  <p className="text-sm text-muted-foreground">Upload photo and compare with reference grades</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </CardContent>
            </Card>
          </Link>

          <Link href="/expert" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-14 h-14 rounded-xl bg-accent/50 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-foreground">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Expert Portal</h3>
                  <p className="text-sm text-muted-foreground">Register or access expert verification dashboard</p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{stats.totalHarvests}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Harvests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-success">{stats.verified}</p>
              <p className="text-sm text-muted-foreground mt-1">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto',
                GRADE_INFO[getGradeLetter(stats.avgGrade)].color
              )}>
                {getGradeLetter(stats.avgGrade)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Avg. Grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Weather & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
                Weather Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center py-4">
                <p className="text-5xl font-bold">{weather[weather.length - 1].temperature}°C</p>
                <p className="text-muted-foreground mt-1">Current Temperature</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-semibold text-blue-500">{weather[weather.length - 1].rainfall}mm</p>
                  <p className="text-xs text-muted-foreground">Rainfall Today</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-lg font-semibold">{weather[weather.length - 1].humidity}%</p>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm">
                  <span className="font-medium">7-day rainfall:</span> {totalRainfall}mm
                </p>
                {totalRainfall > 50 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider extra padding for transport
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Passports */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Harvests</CardTitle>
                <CardDescription>Your latest crop submissions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/passports">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {passports.slice(0, 4).map((passport) => (
                  <div
                    key={passport.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                      GRADE_INFO[passport.grade].color
                    )}>
                      {passport.grade}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium">{passport.batchId}</p>
                      <p className="text-xs text-muted-foreground truncate">{passport.locationName}</p>
                    </div>
                    <Badge
                      variant={
                        passport.verificationStatus === 'verified'
                          ? 'default'
                          : passport.verificationStatus === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {passport.verificationStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Overview of your harvest quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {(['A', 'B', 'C', 'D', 'E'] as CropGrade[]).map((grade) => {
                const count = passports.filter(p => p.grade === grade).length
                const percentage = (count / passports.length) * 100
                return (
                  <div key={grade} className="flex-1 min-w-24">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Grade {grade}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', GRADE_INFO[grade].color)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </main>
    </div>
  )
}

const DynamicDashboard = dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
  loading: () => <DashboardSkeleton />
})

export default function DashboardPage() {
  return <DynamicDashboard />
}
