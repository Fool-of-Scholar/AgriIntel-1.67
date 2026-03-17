'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CropGrade, GRADE_INFO, VerificationQueue, ExpertUser } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ExpertDashboardProps {
  expert: ExpertUser
  queue: VerificationQueue[]
  onVerify: (queueId: string, grade: CropGrade) => void
}

export function ExpertDashboard({ expert, queue, onVerify }: ExpertDashboardProps) {
  const [selectedItem, setSelectedItem] = React.useState<VerificationQueue | null>(null)
  const [selectedGrade, setSelectedGrade] = React.useState<CropGrade | null>(null)

  const pendingItems = queue.filter(q => q.status === 'queued')
  const inReviewItems = queue.filter(q => q.status === 'in_review')
  const completedItems = queue.filter(q => q.status === 'completed')

  const handleVerify = () => {
    if (selectedItem && selectedGrade) {
      onVerify(selectedItem.id, selectedGrade)
      setSelectedItem(null)
      setSelectedGrade(null)
    }
  }

  const getRoleLabel = (role: ExpertUser['role']) => {
    switch (role) {
      case 'agronomist':
        return 'Agronomist'
      case 'cca':
        return 'Certified Crop Adviser'
      case 'researcher':
        return 'Agricultural Researcher'
      case 'student':
        return 'Agriculture Student'
      case 'coop_lead':
        return 'Cooperative Lead'
    }
  }

  const grades: CropGrade[] = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="flex flex-col gap-6">
      {/* Expert Profile */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{expert.name}</h3>
            <p className="text-sm text-muted-foreground">{getRoleLabel(expert.role)}</p>
            {expert.institution && (
              <p className="text-sm text-muted-foreground">{expert.institution}</p>
            )}
          </div>
          <Badge variant={expert.verificationStatus === 'verified' ? 'default' : 'secondary'}>
            {expert.verificationStatus === 'verified' ? 'Verified Expert' : 'Pending Verification'}
          </Badge>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{pendingItems.length}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-warning">{inReviewItems.length}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success">{completedItems.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Queue</CardTitle>
          <CardDescription>Review and verify farmer-submitted grades</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="pending">Pending ({pendingItems.length})</TabsTrigger>
              <TabsTrigger value="in_review">In Review ({inReviewItems.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {pendingItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No pending items in queue</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingItems.map((item) => (
                    <QueueItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="in_review" className="mt-4">
              {inReviewItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No items currently in review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inReviewItems.map((item) => (
                    <QueueItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {completedItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed verifications yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedItems.map((item) => (
                    <QueueItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Panel */}
      {selectedItem && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Review Submission</CardTitle>
            <CardDescription>Batch: {selectedItem.batchId}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submitted Photo */}
              <div>
                <p className="text-sm font-medium mb-2">Submitted Photo</p>
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={selectedItem.photoUrl}
                    alt="Submitted crop"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Farmer Grade:</span>
                  <Badge className={cn(GRADE_INFO[selectedItem.farmerGrade].color, 'text-white')}>
                    Grade {selectedItem.farmerGrade}
                  </Badge>
                </div>
              </div>

              {/* Grade Assignment */}
              <div>
                <p className="text-sm font-medium mb-2">Assign Verified Grade</p>
                <div className="grid grid-cols-5 gap-2">
                  {grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
                        selectedGrade === grade
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-bold', GRADE_INFO[grade].color)}>
                        {grade}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedGrade && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
                    <p className="font-medium">Grade {selectedGrade}: {GRADE_INFO[selectedGrade].label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{GRADE_INFO[selectedGrade].description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={!selectedGrade}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verify as Grade {selectedGrade}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Queue Item Card Component
function QueueItemCard({
  item,
  isSelected,
  onSelect
}: {
  item: VerificationQueue
  isSelected: boolean
  onSelect: () => void
}) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex flex-col rounded-lg border overflow-hidden text-left transition-all',
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      )}
    >
      <div className="relative aspect-video">
        <Image
          src={item.photoUrl}
          alt={`Batch ${item.batchId}`}
          fill
          className="object-cover"
        />
        <Badge
          className={cn(
            'absolute top-2 right-2',
            item.status === 'completed' ? 'bg-success text-success-foreground' :
            item.status === 'in_review' ? 'bg-warning text-warning-foreground' :
            'bg-muted text-muted-foreground'
          )}
        >
          {item.status.replace('_', ' ')}
        </Badge>
      </div>
      <div className="p-3">
        <p className="font-mono text-sm font-medium truncate">{item.batchId}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{formatDate(item.submittedAt)}</span>
          <Badge variant="outline" className="text-xs">
            Farmer: {item.farmerGrade}
          </Badge>
        </div>
      </div>
    </button>
  )
}
