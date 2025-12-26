import { NextResponse } from 'next/server'
import { getAllSettings } from '@/lib/config/settings'

export async function GET() {
  try {
    const settings = getAllSettings()
    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

