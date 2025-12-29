import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Apenas proteger rotas que realmente precisam de autenticação
const isProtectedRoute = createRouteMatcher([
  '/dashboard/create(.*)',
  '/dashboard/result(.*)',
  '/dashboard/settings(.*)',
  '/dashboard/profile(.*)',
  '/api/prompt/generate(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Dashboard principal pode ser acessado sem login
  // Mas ações específicas serão protegidas no componente
  if (isProtectedRoute(req)) {
    await auth.protect()
    }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|ico|png|jpg|jpeg|gif|svg|ttf|woff|woff2)).*)',
    '/(api|trpc)(.*)',
  ],
}
