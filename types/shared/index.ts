// Tipos principais do sistema

export interface User {
  id: string
  email: string
  name: string | null
  credits: number
  subscription: 'free' | 'monthly' | 'pay-per-use'
  stripeId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Prompt {
  id: string
  userId: string
  title: string | null
  content: string
  projectType: string | null
  stack: string | null
  status: 'processing' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  userId: string
  stripeId: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  type: 'one-time' | 'subscription'
  createdAt: Date
}

export interface ProjectAnalysis {
  stack: string[]
  structure: string[]
  components: string[]
  pages: string[]
  functionalities: string[]
  dependencies: Record<string, string>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadResponse {
  prompt: string
  promptId: string
  analysis: ProjectAnalysis
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

