# AgriIntel - Smart Crop Grading & Quality Assurance Platform

AgriIntel is an agricultural intelligence platform that empowers farmers with AI-assisted crop grading, digital traceability, and expert verification systems. Built to address inconsistent quality assessment in agricultural supply chains, it provides standardized grading tools and actionable insights.

---

## Problem Statement

Small-scale farmers in developing regions face significant challenges in crop quality assessment:

1. **Inconsistent Grading**: Without standardized visual references, farmers often misjudge crop quality, leading to rejected shipments and lost income
2. **Lack of Traceability**: No digital record system exists to track produce from farm to market, making quality disputes difficult to resolve
3. **Limited Expert Access**: Agricultural experts are scarce in rural areas, leaving farmers without professional guidance
4. **Weather Impact Blindness**: Farmers lack tools to correlate environmental conditions with crop quality outcomes

---

## Proposed Solution

AgriIntel provides a comprehensive mobile-first web platform with four integrated systems:

### 1. Visual Validator (Side-by-Side Comparison)
- Interactive slider comparing farmer's crop photo against Grade A-E reference images
- Clear grade descriptions based on Philippine export standards
- Touch-optimized for field use on mobile devices

### 2. Digital Passport System
- Unique Batch ID generation (`AGR-[timestamp]-[random]`) for each harvest
- GPS-tagged location with reverse geocoding for human-readable addresses
- Immutable record linking grade, photo, location, and timestamp

### 3. Smart Coach Engine
- Fetches 7-day weather data (rainfall, wind, temperature, humidity)
- Analyzes soil conditions (pH, moisture, NPK levels)
- IF/THEN logic generates contextual insights:
  - Grade C + Heavy Rain = "Reinforce Transport Padding"
  - High Wind = "Check for wind-side mechanical damage"
  - Low Grade = "Consider immediate processing"

### 4. Expert Verification Portal
- Restricted dashboard for verified agricultural professionals
- Role-based access: Agronomists, CCAs, Researchers, Cooperative Leads, Agriculture Students
- Experts assign "Ground Truth" grades to build training datasets
- Verification queue with visual comparison tools

---

## Real-World Application

**Target Users:**
- Smallholder farmers in tropical fruit-producing regions
- Agricultural cooperatives managing quality control
- Export aggregators requiring standardized grading
- Agricultural extension workers and researchers

**Use Cases:**
- Pre-harvest quality assessment for pricing negotiations
- Post-harvest documentation for export compliance
- Dispute resolution with verifiable digital records
- Agricultural research data collection

---

## Technologies Used

### Frontend Framework
- **Next.js 16** - React framework with App Router, Server Components, and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Type-safe development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Icon library

### State & Forms
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **SWR pattern** - Data fetching and caching

### Data Visualization
- **Recharts** - Composable charting library

### Development Tools
- **v0 by Vercel** - AI-powered development assistant
- **Vercel** - Deployment and hosting platform

### APIs & Services (Simulated in Prototype)
- GPS Geolocation API (browser native)
- Reverse Geocoding (Nominatim/OpenStreetMap)
- Weather Data API
- Soil Analysis API

---

## Project Structure

```
/app
  /page.tsx          - Dashboard with stats and recent activity
  /grade/page.tsx    - Visual Validator grading interface
  /passports/page.tsx - Digital Passport management
  /expert/page.tsx   - Expert verification portal

/components
  /visual-validator.tsx   - Side-by-side comparison slider
  /photo-upload.tsx       - Camera/upload with GPS capture
  /digital-passport.tsx   - Passport display and generation
  /smart-coach.tsx        - AI insights panel
  /expert-dashboard.tsx   - Verification queue management
  /expert-registration.tsx - Expert credential submission
  /error-boundary.tsx     - Error handling wrapper
  /header.tsx             - Navigation header

/lib
  /types.ts        - TypeScript interfaces and constants
  /mock-data.ts    - Simulated API data generators
  /utils.ts        - Utility functions
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Fool-of-Scholar/AgriIntel-1.67.git
cd AgriIntel-1.67

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Feature Walkthrough

1. **Dashboard** (`/`) - Overview of grading statistics, recent passports, and weather conditions
2. **Grade Crop** (`/grade`) - Upload photo, capture GPS, use visual validator, generate passport
3. **Passports** (`/passports`) - View all digital passports with filtering and search
4. **Expert Portal** (`/expert`) - Register as expert, access verification queue, assign ground truth grades

---

## Future Roadmap

- [ ] Machine Learning model integration for automated grading suggestions
- [ ] Blockchain-based passport verification for immutable records
- [ ] Offline-first PWA for areas with limited connectivity
- [ ] Multi-language support (Filipino, Cebuano, etc.)
- [ ] Integration with agricultural cooperative management systems
- [ ] Historical trend analysis and yield prediction

---

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below.

[Continue working on v0](https://v0.app/chat/projects/prj_6tgfuWPGUO1qSzn4tAepuVYTYelw)

---

## Team

AgriIntel Prototype - Built for agricultural innovation

---

## License

This project is a prototype for demonstration purposes.
