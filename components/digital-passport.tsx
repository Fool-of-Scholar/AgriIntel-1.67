'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BatchPassport, GRADE_INFO } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DigitalPassportProps {
  passport: BatchPassport
}

export function DigitalPassport({ passport }: DigitalPassportProps) {
  const gradeInfo = GRADE_INFO[passport.grade]
  const [copied, setCopied] = React.useState(false)

  const copyBatchId = async () => {
    await navigator.clipboard.writeText(passport.batchId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Card className="overflow-hidden">
      <div className={cn('h-2', gradeInfo.color)} />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Digital Passport</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Harvest Certificate</p>
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
            {passport.verificationStatus === 'verified' && '✓ '}
            {passport.verificationStatus.charAt(0).toUpperCase() + passport.verificationStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Batch ID */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Batch ID</p>
            <p className="font-mono font-semibold text-lg">{passport.batchId}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={copyBatchId}>
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </Button>
        </div>

        {/* Photo & Grade */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={passport.photoUrl}
              alt="Crop photo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Assigned Grade</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white font-bold', gradeInfo.color)}>
                  {passport.grade}
                </div>
                <span className="font-medium">{gradeInfo.label}</span>
              </div>
            </div>
            {passport.verifiedGrade && passport.verifiedGrade !== passport.grade && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Expert Verified</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white font-bold', GRADE_INFO[passport.verifiedGrade].color)}>
                    {passport.verifiedGrade}
                  </div>
                  <span className="font-medium">{GRADE_INFO[passport.verifiedGrade].label}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">GPS Location</p>
              <p className="text-sm font-medium truncate">{passport.locationName}</p>
              <p className="text-xs text-muted-foreground">
                {passport.gpsLatitude.toFixed(6)}, {passport.gpsLongitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium">{formatDate(passport.createdAt)}</span>
        </div>

        {passport.verifiedBy && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Verified by</span>
            <span className="font-medium">{passport.verifiedBy}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
