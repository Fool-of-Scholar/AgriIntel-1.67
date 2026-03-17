'use client'

import * as React from 'react'
import { Header } from '@/components/header'
import { ExpertDashboard } from '@/components/expert-dashboard'
import { ExpertRegistration } from '@/components/expert-registration'
import { ErrorBoundary, LoadingState } from '@/components/error-boundary'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateVerificationQueue } from '@/lib/mock-data'
import { ExpertUser, VerificationQueue, CropGrade } from '@/lib/types'

export default function ExpertPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [expert, setExpert] = React.useState<ExpertUser | null>(null)
  const [queue, setQueue] = React.useState<VerificationQueue[]>([])
  const [activeTab, setActiveTab] = React.useState<'login' | 'register'>('login')

  // Simulated login state check
  React.useEffect(() => {
    // Check for existing session (in real app, this would be auth check)
    const savedExpert = typeof window !== 'undefined' ? sessionStorage.getItem('expert') : null
    if (savedExpert) {
      setExpert(JSON.parse(savedExpert))
      setQueue(generateVerificationQueue())
    }
  }, [])

  const handleLogin = async (email: string) => {
    setIsLoading(true)
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockExpert: ExpertUser = {
      id: 'expert-1',
      email,
      name: 'Dr. Ahmad Hassan',
      role: 'agronomist',
      verificationStatus: 'verified',
      credentials: 'AGR-2024-001',
      institution: 'Universiti Sains Malaysia',
      verifiedAt: new Date()
    }
    
    setExpert(mockExpert)
    setQueue(generateVerificationQueue())
    sessionStorage.setItem('expert', JSON.stringify(mockExpert))
    setIsLoading(false)
  }

  const handleRegister = async (data: Omit<ExpertUser, 'id' | 'verificationStatus' | 'verifiedAt'>) => {
    const newExpert: ExpertUser = {
      ...data,
      id: `expert-${Date.now()}`,
      verificationStatus: 'pending'
    }
    
    setExpert(newExpert)
    setQueue([])
    sessionStorage.setItem('expert', JSON.stringify(newExpert))
  }

  const handleVerify = (queueId: string, grade: CropGrade) => {
    setQueue(prev => prev.map(item => 
      item.id === queueId 
        ? { ...item, status: 'completed' as const, assignedExpert: expert?.name }
        : item
    ))
  }

  const handleLogout = () => {
    setExpert(null)
    setQueue([])
    sessionStorage.removeItem('expert')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <LoadingState message="Signing in..." />
        </main>
      </div>
    )
  }

  // If expert is logged in
  if (expert) {
    // If pending verification
    if (expert.verificationStatus === 'pending') {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8">
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <CardTitle>Verification Pending</CardTitle>
                <CardDescription>
                  Your expert application is under review
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="font-medium">{expert.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-medium">{expert.email}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge variant="secondary">{expert.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-warning/10 text-warning-foreground">Pending Review</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Our team will verify your credentials within 24-48 hours. 
                  You will receive an email notification once approved.
                </p>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      )
    }

    // Verified expert - show dashboard
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Expert Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Verify crop grades and build our training dataset
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
          
          <ErrorBoundary>
            <ExpertDashboard
              expert={expert}
              queue={queue}
              onVerify={handleVerify}
            />
          </ErrorBoundary>
        </main>
      </div>
    )
  }

  // Not logged in - show login/register
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-xl mx-auto">
          {/* Info Banner */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Restricted Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This portal is exclusively for verified agricultural experts: 
                  Agronomists, Certified Crop Advisers (CCAs), Agricultural Researchers, 
                  Cooperative Leaders, and Agriculture Students with valid credentials.
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expert Sign In</CardTitle>
                  <CardDescription>
                    Access your verification dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      handleLogin(formData.get('email') as string)
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your registered email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Enter your password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Demo: Enter any email to simulate login
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <ExpertRegistration onRegister={handleRegister} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
