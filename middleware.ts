import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminAuth = request.cookies.get('formwork_admin_auth')
        // Allow through — client side handles the gate in /app/admin/page.tsx
        return NextResponse.next()
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
