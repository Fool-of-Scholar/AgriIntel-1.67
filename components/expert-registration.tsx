'use client'

import * as React from 'react'
import { ExpertUser } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface ExpertRegistrationProps {
  onRegister: (expert: Omit<ExpertUser, 'id' | 'verificationStatus' | 'verifiedAt'>) => void
}

export function ExpertRegistration({ onRegister }: ExpertRegistrationProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    role: '' as ExpertUser['role'] | '',
    credentials: '',
    institution: ''
  })

  const roles: { value: ExpertUser['role']; label: string; description: string }[] = [
    { value: 'agronomist', label: 'Agronomist', description: 'Professional degree in agronomy or related field' },
    { value: 'cca', label: 'Certified Crop Adviser (CCA)', description: 'CCA certification holder' },
    { value: 'researcher', label: 'Agricultural Researcher', description: 'Research position at university or institution' },
    { value: 'coop_lead', label: 'Cooperative Lead', description: 'Leader of agricultural cooperative' },
    { value: 'student', label: 'Agriculture Student', description: 'Currently enrolled in agricultural studies' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.role) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onRegister({
      email: formData.email,
      name: formData.name,
      role: formData.role as ExpertUser['role'],
      credentials: formData.credentials,
      institution: formData.institution
    })
    
    setIsSubmitting(false)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <CardTitle>Expert Verification Portal</CardTitle>
        <CardDescription>
          Register as an agricultural expert to help verify crop grades and build our training dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your professional email"
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Select Your Role</FieldLabel>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      formData.role === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      formData.role === role.value ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {formData.role === role.value && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Institution / Organization</FieldLabel>
              <Input
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                placeholder="e.g., University of Science Malaysia"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Credentials / Student ID</FieldLabel>
              <Input
                value={formData.credentials}
                onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
                placeholder="Enter your certification number or student ID"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be verified by our admin team before granting access
              </p>
            </Field>
          </FieldGroup>

          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Your application will be reviewed by our team. 
              You will receive an email notification once your expert status is verified.
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting || !formData.role} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Submitting Application...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
