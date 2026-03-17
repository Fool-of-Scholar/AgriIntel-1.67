'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CropGrade, GRADE_INFO } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface VisualValidatorProps {
  userImage: string | null
  onGradeSelect: (grade: CropGrade) => void
  selectedGrade: CropGrade | null
}

export function VisualValidator({ userImage, onGradeSelect, selectedGrade }: VisualValidatorProps) {
  const [comparisonGrade, setComparisonGrade] = React.useState<CropGrade>('A')
  const [sliderPosition, setSliderPosition] = React.useState(50)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isDragging = React.useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const grades: CropGrade[] = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Visual Grade Comparison</CardTitle>
          <CardDescription>
            Drag the slider to compare your crop photo with reference grades
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Grade Selection Tabs */}
          <div className="flex flex-wrap gap-2">
            {grades.map((grade) => (
              <Button
                key={grade}
                variant={comparisonGrade === grade ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonGrade(grade)}
                className="min-w-16"
              >
                Grade {grade}
              </Button>
            ))}
          </div>

          {/* Comparison Slider */}
          <div
            ref={containerRef}
            className="relative aspect-video w-full cursor-ew-resize overflow-hidden rounded-lg border bg-muted"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Reference Image (Background) */}
            <div className="absolute inset-0">
              <Image
                src={GRADE_INFO[comparisonGrade].image}
                alt={`Grade ${comparisonGrade} reference`}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Badge className={cn(GRADE_INFO[comparisonGrade].color, 'text-white')}>
                  Reference: Grade {comparisonGrade}
                </Badge>
              </div>
            </div>

            {/* User Image (Overlay with clip) */}
            {userImage ? (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src={userImage}
                  alt="Your crop photo"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary">Your Photo</Badge>
                </div>
              </div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center bg-muted/80 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <p className="text-muted-foreground text-sm">Upload your crop photo</p>
              </div>
            )}

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-background shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-primary shadow-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12H16M8 12L11 9M8 12L11 15M16 12L13 9M16 12L13 15" />
                </svg>
              </div>
            </div>
          </div>

          {/* Grade Info */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-4">
              <div className={cn('w-2 h-full min-h-16 rounded-full', GRADE_INFO[comparisonGrade].color)} />
              <div className="flex-1">
                <h4 className="font-semibold">Grade {comparisonGrade}: {GRADE_INFO[comparisonGrade].label}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {GRADE_INFO[comparisonGrade].description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Grade</CardTitle>
          <CardDescription>
            Based on your comparison, select the grade that best matches your crop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => onGradeSelect(grade)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  selectedGrade === grade
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl', GRADE_INFO[grade].color)}>
                  {grade}
                </div>
                <span className="text-sm font-medium">{GRADE_INFO[grade].label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
