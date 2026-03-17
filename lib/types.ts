export type CropGrade = 'A' | 'B' | 'C' | 'D' | 'E'

export interface GradeInfo {
  grade: CropGrade
  label: string
  description: string
  color: string
  image: string
}

export interface WeatherData {
  date: string
  rainfall: number // mm
  windSpeed: number // km/h
  humidity: number // %
  temperature: number // celsius
}

export interface SoilData {
  ph: number
  moisture: number // %
  nitrogen: number // mg/kg
  phosphorus: number // mg/kg
  potassium: number // mg/kg
}

export interface BatchPassport {
  id: string
  batchId: string
  userId: string
  grade: CropGrade
  photoUrl: string
  gpsLatitude: number
  gpsLongitude: number
  locationName: string
  createdAt: Date
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedBy?: string
  verifiedGrade?: CropGrade
  weatherConditions?: WeatherData[]
  soilData?: SoilData
  smartCoachInsights?: SmartCoachInsight[]
}

export interface SmartCoachInsight {
  id: string
  type: 'warning' | 'suggestion' | 'info'
  title: string
  description: string
  trigger: string // e.g., "heavy_rain_grade_c"
  priority: 'high' | 'medium' | 'low'
}

export interface ExpertUser {
  id: string
  email: string
  name: string
  role: 'agronomist' | 'cca' | 'researcher' | 'student' | 'coop_lead'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  credentials?: string
  institution?: string
  verifiedAt?: Date
}

export interface VerificationQueue {
  id: string
  batchId: string
  photoUrl: string
  farmerGrade: CropGrade
  submittedAt: Date
  assignedExpert?: string
  status: 'queued' | 'in_review' | 'completed'
}

export const GRADE_INFO: Record<CropGrade, GradeInfo> = {
  A: {
    grade: 'A',
    label: 'Premium Export',
    description: 'Perfect condition, no blemishes, uniform color and size. Meets highest export standards.',
    color: 'bg-emerald-500',
    image: '/images/grade-a.jpg'
  },
  B: {
    grade: 'B',
    label: 'Export Quality',
    description: 'Minor superficial marks, good overall quality. Acceptable for most export markets.',
    color: 'bg-green-500',
    image: '/images/grade-b.jpg'
  },
  C: {
    grade: 'C',
    label: 'Domestic Market',
    description: 'Visible blemishes, uneven ripening. Suitable for local markets only.',
    color: 'bg-yellow-500',
    image: '/images/grade-c.jpg'
  },
  D: {
    grade: 'D',
    label: 'Processing Only',
    description: 'Multiple defects, bruising. Only suitable for processing into products.',
    color: 'bg-orange-500',
    image: '/images/grade-d.jpg'
  },
  E: {
    grade: 'E',
    label: 'Reject',
    description: 'Significant damage or decay. Not suitable for sale or processing.',
    color: 'bg-red-500',
    image: '/images/grade-e.jpg'
  }
}

export function generateBatchId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AGR-${timestamp}-${random}`
}

export function generateSmartCoachInsights(
  grade: CropGrade,
  weather: WeatherData[],
  soil?: SoilData
): SmartCoachInsight[] {
  const insights: SmartCoachInsight[] = []
  
  // Check for heavy rainfall in last 7 days
  const totalRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0)
  const avgWindSpeed = weather.reduce((sum, w) => sum + w.windSpeed, 0) / weather.length
  
  // Grade C with heavy rain - suggest padding
  if (grade === 'C' && totalRainfall > 50) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: 'suggestion',
      title: 'Reinforce Transport Padding',
      description: 'Heavy rainfall detected in the past week may have softened the fruit. Use additional padding during transport to prevent further damage.',
      trigger: 'heavy_rain_grade_c',
      priority: 'high'
    })
  }
  
  // High wind conditions
  if (avgWindSpeed > 30) {
    insights.push({
      id: `insight-${Date.now()}-2`,
      type: 'warning',
      title: 'Wind Damage Risk',
      description: 'High wind conditions detected. Check for hidden mechanical damage on the windward side of the fruit.',
      trigger: 'high_wind',
      priority: 'medium'
    })
  }
  
  // Soil-based insights
  if (soil) {
    if (soil.ph < 5.5 || soil.ph > 7.5) {
      insights.push({
        id: `insight-${Date.now()}-3`,
        type: 'info',
        title: 'Soil pH Outside Optimal Range',
        description: `Soil pH of ${soil.ph} may affect fruit quality. Consider soil amendment for future harvests.`,
        trigger: 'ph_imbalance',
        priority: 'low'
      })
    }
    
    if (soil.moisture > 80) {
      insights.push({
        id: `insight-${Date.now()}-4`,
        type: 'warning',
        title: 'High Soil Moisture',
        description: 'Excessive soil moisture may lead to waterlogging and root issues. Monitor drainage.',
        trigger: 'high_moisture',
        priority: 'medium'
      })
    }
  }
  
  // Grade-specific general advice
  if (grade === 'D' || grade === 'E') {
    insights.push({
      id: `insight-${Date.now()}-5`,
      type: 'suggestion',
      title: 'Consider Immediate Processing',
      description: 'Lower grade produce should be processed quickly to maximize value. Contact local processing facilities.',
      trigger: 'low_grade',
      priority: 'high'
    })
  }
  
  return insights
}
