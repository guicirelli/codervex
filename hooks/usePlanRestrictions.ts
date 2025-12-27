'use client'

import { useUser } from '@clerk/nextjs'
import { useMemo } from 'react'

export type PlanType = 'free' | 'monthly' | 'pay-per-use'

export interface PlanRestrictions {
  canCreateProject: boolean
  maxProjects: number | null // null = ilimitado
  canUseCustomization: boolean
  canAccessAPI: boolean
  supportLevel: 'email' | 'priority' | 'none'
}

const PLAN_LIMITS: Record<PlanType, PlanRestrictions> = {
  free: {
    canCreateProject: true,
    maxProjects: 1,
    canUseCustomization: false,
    canAccessAPI: false,
    supportLevel: 'none',
  },
  'pay-per-use': {
    canCreateProject: true,
    maxProjects: null, // Ilimitado, mas paga por uso
    canUseCustomization: true,
    canAccessAPI: false,
    supportLevel: 'email',
  },
  monthly: {
    canCreateProject: true,
    maxProjects: null, // Ilimitado
    canUseCustomization: true,
    canAccessAPI: true,
    supportLevel: 'priority',
  },
}

export function usePlanRestrictions() {
  const { user, isLoaded } = useUser()

  const plan: PlanType = useMemo(() => {
    if (!user || !isLoaded) return 'free'
    
    // Aqui você pode buscar o plano do usuário do banco de dados
    // Por enquanto, vamos usar um valor padrão baseado em metadata do Clerk
    const userPlan = user.publicMetadata?.plan as PlanType | undefined
    return userPlan || 'free'
  }, [user, isLoaded])

  const restrictions = useMemo(() => {
    return PLAN_LIMITS[plan]
  }, [plan])

  const isPlanActive = useMemo(() => {
    return user !== null && isLoaded
  }, [user, isLoaded])

  return {
    plan,
    restrictions,
    isPlanActive,
    isLoaded,
  }
}

