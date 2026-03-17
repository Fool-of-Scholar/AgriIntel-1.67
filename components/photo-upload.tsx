'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

interface PhotoUploadProps {
  onPhotoCapture: (photoUrl: string) => void
  onLocationCapture: (lat: number, lng: number, locationName: string) => void
  capturedPhoto: string | null
  location: { lat: number; lng: number; name: string } | null
}

export function PhotoUpload({ onPhotoCapture, onLocationCapture, capturedPhoto, location }: PhotoUploadProps) {
  const [isCapturingLocation, setIsCapturingLocation] = React.useState(false)
  const [locationError, setLocationError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onPhotoCapture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const captureLocation = async () => {
    setIsCapturingLocation(true)
    setLocationError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords
      
      // Reverse geocode to get location name
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        const data = await response.json()
        const locationName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        onLocationCapture(latitude, longitude, locationName)
      } catch {
        onLocationCapture(latitude, longitude, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
        }
      } else {
        setLocationError('Failed to get location.')
      }
    } finally {
      setIsCapturingLocation(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capture Crop Photo</CardTitle>
        <CardDescription>
          Upload a high-resolution photo of your crop and capture GPS location
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Photo Upload Area */}
        <div
          className={cn(
            'relative aspect-video w-full rounded-lg border-2 border-dashed transition-colors',
            capturedPhoto ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
        >
          {capturedPhoto ? (
            <div className="relative w-full h-full">
              <Image
                src={capturedPhoto}
                alt="Captured crop"
                fill
                className="object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Photo
              </Button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium">Click to upload photo</p>
                <p className="text-sm text-muted-foreground">or drag and drop</p>
              </div>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* GPS Location */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="font-medium">GPS Location</span>
            </div>
            {location && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                Captured
              </Badge>
            )}
          </div>

          {location ? (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{location.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={captureLocation}
              disabled={isCapturingLocation}
              className="w-full"
            >
              {isCapturingLocation ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Capturing Location...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="22" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="12" x2="2" y2="12" />
                    <line x1="12" y1="6" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="18" />
                  </svg>
                  Capture GPS Location
                </>
              )}
            </Button>
          )}

          {locationError && (
            <p className="text-sm text-destructive">{locationError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
