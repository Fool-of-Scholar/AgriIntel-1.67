'use client'

import * as React from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { DigitalPassport } from '@/components/digital-passport'
import { SmartCoach } from '@/components/smart-coach'
import { ErrorBoundary, CardSkeleton } from '@/components/error-boundary'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateMockPassports } from '@/lib/mock-data'
import { BatchPassport, GRADE_INFO } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function PassportsPage() {
  const [passports, setPassports] = React.useState<BatchPassport[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedPassport, setSelectedPassport] = React.useState<BatchPassport | null>(null)
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'verified' | 'rejected'>('all')

  React.useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setPassports(generateMockPassports(8))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredPassports = passports.filter(p => {
    if (filter === 'all') return true
    return p.verificationStatus === filter
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Passports</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your harvest digital passports
            </p>
          </div>
          <Button asChild>
            <a href="/grade">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Grade New Harvest
            </a>
          </Button>
        </div>

        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Passports List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Harvest Records</CardTitle>
                  <CardDescription>{passports.length} total passports</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'verified', 'rejected'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status !== 'all' && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {passports.filter(p => p.verificationStatus === status).length}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Passports List */}
                  <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-3 rounded-lg border animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded" />
                            <div className="flex-1">
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-3 w-16 bg-muted rounded mt-2" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : filteredPassports.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No passports found</p>
                      </div>
                    ) : (
                      filteredPassports.map((passport) => (
                        <button
                          key={passport.id}
                          onClick={() => setSelectedPassport(passport)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                            selectedPassport?.id === passport.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                            <Image
                              src={passport.photoUrl}
                              alt={`Batch ${passport.batchId}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold',
                                GRADE_INFO[passport.grade].color
                              )}>
                                {passport.grade}
                              </div>
                              <p className="font-mono text-sm truncate">{passport.batchId}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{formatDate(passport.createdAt)}</p>
                          </div>
                          <Badge
                            variant={
                              passport.verificationStatus === 'verified'
                                ? 'default'
                                : passport.verificationStatus === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-xs shrink-0"
                          >
                            {passport.verificationStatus}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Passport Detail */}
            <div className="lg:col-span-2">
              {selectedPassport ? (
                <Tabs defaultValue="passport">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="passport">Digital Passport</TabsTrigger>
                    <TabsTrigger value="insights">Smart Coach</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="passport" className="mt-4">
                    <DigitalPassport passport={selectedPassport} />
                  </TabsContent>
                  
                  <TabsContent value="insights" className="mt-4">
                    {selectedPassport.weatherConditions && selectedPassport.smartCoachInsights ? (
                      <SmartCoach
                        insights={selectedPassport.smartCoachInsights}
                        weather={selectedPassport.weatherConditions}
                        soil={selectedPassport.soilData}
                      />
                    ) : (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <p className="text-muted-foreground">No diagnostic data available</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Select a Passport</h3>
                    <p className="text-muted-foreground">
                      Choose a harvest record from the list to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  )
}
