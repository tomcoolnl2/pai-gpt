import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const session = await getSession(req, res);

	if (!session) {
		return NextResponse.next();
	} else {
		return NextResponse.redirect(new URL('/chat', req.url));
	}
}

export const config = {
	matcher: ['/api/chat/:path*', '/chat/:path*', '/'],
};
