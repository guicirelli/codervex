import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/core/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura não fornecida' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Erro ao verificar webhook:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          if (session.mode === 'subscription') {
            // Atualizar para assinatura mensal
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: 'monthly',
                stripeId: session.customer as string,
              },
            })
          } else {
            // Adicionar créditos
            await prisma.user.update({
              where: { id: userId },
              data: {
                credits: {
                  increment: 1,
                },
              },
            })
          }

          // Registrar pagamento
          await prisma.payment.create({
            data: {
              userId,
              stripeId: session.id,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'succeeded',
              type: session.mode === 'subscription' ? 'subscription' : 'one-time',
            },
          })
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Lógica adicional se necessário
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

