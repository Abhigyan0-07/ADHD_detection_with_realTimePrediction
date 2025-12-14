import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('focusflow_token')?.value
  const isAuth = Boolean(token)
  const { pathname } = request.nextUrl

  const authPaths = ['/login', '/signup']
  const isAuthRoute = authPaths.some(p => pathname.startsWith(p) || pathname.startsWith(`/(${p.replace('/','')})/${p.split('/').pop()}`))
  const isDashboard = pathname.startsWith('/dashboard')

  if (!isAuth && isDashboard) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuth && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/(auth)/login', '/(auth)/signup']
}

