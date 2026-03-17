'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { PhotoUpload } from '@/components/photo-upload'
import { VisualValidator } from '@/components/visual-validator'
import { SmartCoach } from '@/components/smart-coach'
import { DigitalPassport } from '@/components/digital-passport'
import { ErrorBoundary, LoadingState } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CropGrade, BatchPassport } from '@/lib/types'
import { createBatchPassport, generateWeatherData, generateSoilData } from '@/lib/mock-data'

type Step = 'capture' | 'grade' | 'insights' | 'passport'

export default function GradePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<Step>('capture')
  const [capturedPhoto, setCapturedPhoto] = React.useState<string | null>(null)
  const [location, setLocation] = React.useState<{ lat: number; lng: number; name: string } | null>(null)
  const [selectedGrade, setSelectedGrade] = React.useState<CropGrade | null>(null)
  const [passport, setPassport] = React.useState<BatchPassport | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [weather] = React.useState(() => generateWeatherData())
  const [soil] = React.useState(() => generateSoilData())

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'capture', label: 'Capture', number: 1 },
    { key: 'grade', label: 'Grade', number: 2 },
    { key: 'insights', label: 'Insights', number: 3 },
    { key: 'passport', label: 'Passport', number: 4 }
  ]

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  const handlePhotoCapture = (photoUrl: string) => {
    setCapturedPhoto(photoUrl)
  }

  const handleLocationCapture = (lat: number, lng: number, name: string) => {
    setLocation({ lat, lng, name })
  }

  const handleGradeSelect = (grade: CropGrade) => {
    setSelectedGrade(grade)
  }

  const handleNextStep = async () => {
    if (currentStep === 'capture' && capturedPhoto && location) {
      setCurrentStep('grade')
    } else if (currentStep === 'grade' && selectedGrade) {
      setCurrentStep('insights')
    } else if (currentStep === 'insights') {
      setIsGenerating(true)
      // Simulate passport generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newPassport = createBatchPassport(
        'user-1',
        selectedGrade!,
        capturedPhoto!,
        location!.lat,
        location!.lng,
        location!.name
      )
      
      setPassport(newPassport)
      setIsGenerating(false)
      setCurrentStep('passport')
    }
  }

  const handleReset = () => {
    setCapturedPhoto(null)
    setLocation(null)
    setSelectedGrade(null)
    setPassport(null)
    setCurrentStep('capture')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'capture':
        return !!capturedPhoto && !!location
      case 'grade':
        return !!selectedGrade
      case 'insights':
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Grade Your Harvest</h1>
          <p className="text-muted-foreground mt-2">
            Follow the steps to grade your crop and generate a digital passport
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${
                    index <= currentStepIndex ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <ErrorBoundary>
          {currentStep === 'capture' && (
            <div className="max-w-2xl mx-auto">
              <PhotoUpload
                onPhotoCapture={handlePhotoCapture}
                onLocationCapture={handleLocationCapture}
                capturedPhoto={capturedPhoto}
                location={location}
              />
            </div>
          )}

          {currentStep === 'grade' && (
            <div className="max-w-4xl mx-auto">
              <VisualValidator
                userImage={capturedPhoto}
                onGradeSelect={handleGradeSelect}
                selectedGrade={selectedGrade}
              />
            </div>
          )}

          {currentStep === 'insights' && selectedGrade && (
            <div className="max-w-4xl mx-auto">
              <SmartCoach
                insights={passport?.smartCoachInsights || []}
                weather={weather}
                soil={soil}
              />
            </div>
          )}

          {currentStep === 'passport' && (
            <div className="max-w-md mx-auto">
              {isGenerating ? (
                <LoadingState message="Generating your digital passport..." />
              ) : passport ? (
                <div className="flex flex-col gap-6">
                  <DigitalPassport passport={passport} />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-success">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Passport Generated
                      </CardTitle>
                      <CardDescription>
                        Your harvest has been recorded and submitted for expert verification
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <Button onClick={() => router.push('/passports')} className="w-full">
                        View All Passports
                      </Button>
                      <Button variant="outline" onClick={handleReset} className="w-full">
                        Grade Another Harvest
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </ErrorBoundary>

        {/* Navigation Buttons */}
        {currentStep !== 'passport' && (
          <div className="flex items-center justify-between max-w-4xl mx-auto mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const prevIndex = currentStepIndex - 1
                if (prevIndex >= 0) {
                  setCurrentStep(steps[prevIndex].key)
                }
              }}
              disabled={currentStepIndex === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!canProceed() || isGenerating}
            >
              {currentStep === 'insights' ? 'Generate Passport' : 'Continue'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
