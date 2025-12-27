'use client'

import dynamic from 'next/dynamic'

// Wrapper client para FeedbackWidget com lazy loading
const FeedbackWidget = dynamic(() => import('@/components/shared/ui/FeedbackWidget'), {
  ssr: false,
})

export default function FeedbackWidgetWrapper() {
  return <FeedbackWidget />
}

