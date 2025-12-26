// Sistema de notificações por email
// Em produção, usar serviço como SendGrid, Resend, ou AWS SES

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Em desenvolvimento, apenas logar
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email que seria enviado:', {
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    return true
  }

  // Em produção, integrar com serviço de email
  // Exemplo com Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  try {
    await resend.emails.send({
      from: 'Custom PE <noreply@custompe.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
  */

  return true
}

export async function sendPromptReadyEmail(
  email: string,
  promptTitle: string,
  promptId: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Seu Superprompt está pronto!</h1>
          </div>
          <div class="content">
            <p>Olá!</p>
            <p>Seu superprompt <strong>${promptTitle}</strong> foi gerado com sucesso!</p>
            <p>Você pode acessá-lo agora mesmo no seu dashboard.</p>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="button">
              Ver Prompt
            </a>
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Se você não solicitou este prompt, pode ignorar este email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '✨ Seu Superprompt está pronto!',
    html,
    text: `Seu superprompt "${promptTitle}" foi gerado com sucesso! Acesse: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
  })
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bem-vindo ao Custom PE! 🎉</h1>
          </div>
          <div class="content">
            <p>Olá, ${name}!</p>
            <p>Bem-vindo ao Custom PE! Estamos felizes em tê-lo conosco.</p>
            <p><strong>Você tem direito a 1 prompt gratuito!</strong> Use-o para testar nossa plataforma.</p>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="button">
              Começar Agora
            </a>
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Precisa de ajuda? Acesse nosso <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/how-to-use">guia de uso</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Bem-vindo ao Custom PE! 🎉',
    html,
    text: `Bem-vindo ao Custom PE, ${name}! Você tem direito a 1 prompt gratuito. Acesse: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
  })
}

