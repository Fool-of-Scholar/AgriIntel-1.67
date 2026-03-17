import { 
  WeatherData, 
  SoilData, 
  BatchPassport, 
  VerificationQueue,
  CropGrade,
  generateBatchId,
  generateSmartCoachInsights
} from './types'

// Generate mock weather data for the last 7 days
export function generateWeatherData(): WeatherData[] {
  const weather: WeatherData[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    weather.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rainfall: Math.round(Math.random() * 30),
      windSpeed: Math.round(10 + Math.random() * 25),
      humidity: Math.round(60 + Math.random() * 30),
      temperature: Math.round(25 + Math.random() * 10)
    })
  }

  return weather
}

// Generate mock soil data
export function generateSoilData(): SoilData {
  return {
    ph: Number((5.5 + Math.random() * 2.5).toFixed(1)),
    moisture: Math.round(40 + Math.random() * 40),
    nitrogen: Math.round(150 + Math.random() * 100),
    phosphorus: Math.round(30 + Math.random() * 40),
    potassium: Math.round(100 + Math.random() * 80)
  }
}

// Create a batch passport
export function createBatchPassport(
  userId: string,
  grade: CropGrade,
  photoUrl: string,
  latitude: number,
  longitude: number,
  locationName: string
): BatchPassport {
  const weather = generateWeatherData()
  const soil = generateSoilData()
  
  return {
    id: `passport-${Date.now()}`,
    batchId: generateBatchId(),
    userId,
    grade,
    photoUrl,
    gpsLatitude: latitude,
    gpsLongitude: longitude,
    locationName,
    createdAt: new Date(),
    verificationStatus: 'pending',
    weatherConditions: weather,
    soilData: soil,
    smartCoachInsights: generateSmartCoachInsights(grade, weather, soil)
  }
}

// Sample verification queue items
export function generateVerificationQueue(): VerificationQueue[] {
  const grades: CropGrade[] = ['A', 'B', 'C', 'D', 'E']
  const queue: VerificationQueue[] = []

  // Generate some sample queue items
  for (let i = 0; i < 8; i++) {
    const submittedAt = new Date()
    submittedAt.setHours(submittedAt.getHours() - Math.floor(Math.random() * 48))
    
    const status = i < 3 ? 'queued' : i < 5 ? 'in_review' : 'completed'
    
    queue.push({
      id: `queue-${i + 1}`,
      batchId: generateBatchId(),
      photoUrl: `/images/grade-${grades[Math.floor(Math.random() * grades.length)].toLowerCase()}.jpg`,
      farmerGrade: grades[Math.floor(Math.random() * grades.length)],
      submittedAt,
      status,
      assignedExpert: status !== 'queued' ? 'Expert User' : undefined
    })
  }

  return queue.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
}

// Mock passport data for the passports page
export function generateMockPassports(count: number = 5): BatchPassport[] {
  const grades: CropGrade[] = ['A', 'B', 'C', 'D', 'E']
  const locations = [
    { name: 'Kampung Padang Farm, Penang', lat: 5.4164, lng: 100.3327 },
    { name: 'Sungai Petani Agricultural Zone', lat: 5.6474, lng: 100.5078 },
    { name: 'Kulim Hi-Tech Park Facility', lat: 5.3714, lng: 100.5553 },
    { name: 'Bayan Lepas Free Trade Zone', lat: 5.3019, lng: 100.2685 },
    { name: 'George Town Urban Farm', lat: 5.4141, lng: 100.3288 }
  ]

  return Array.from({ length: count }, (_, i) => {
    const grade = grades[Math.floor(Math.random() * grades.length)]
    const location = locations[i % locations.length]
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - i * 2)
    
    const verificationStatuses: ('pending' | 'verified' | 'rejected')[] = ['pending', 'verified', 'verified', 'verified', 'rejected']
    const status = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)]
    
    const weather = generateWeatherData()
    const soil = generateSoilData()
    
    return {
      id: `passport-mock-${i + 1}`,
      batchId: generateBatchId(),
      userId: 'user-1',
      grade,
      photoUrl: `/images/grade-${grade.toLowerCase()}.jpg`,
      gpsLatitude: location.lat,
      gpsLongitude: location.lng,
      locationName: location.name,
      createdAt,
      verificationStatus: status,
      verifiedBy: status === 'verified' ? 'Dr. Ahmad Hassan' : undefined,
      verifiedGrade: status === 'verified' ? (Math.random() > 0.7 ? grades[Math.floor(Math.random() * grades.length)] : grade) : undefined,
      weatherConditions: weather,
      soilData: soil,
      smartCoachInsights: generateSmartCoachInsights(grade, weather, soil)
    }
  })
}
