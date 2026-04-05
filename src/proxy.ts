import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Remove locale (/en, /ar, ...)
  const segments = pathname.split('/');
  const locale = segments[1]; // e.g. "en" or "ar"
  const pathWithoutLocale = '/' + segments.slice(2).join('/');

  // 1. Get the user token (session)
  const isAuth = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  console.log("isAuth ", isAuth);

  // 2. Define your route logic
  const protectedRoutes = ['/company', '/candidate'];
  const isAuthRoute = pathWithoutLocale.startsWith('/auth');
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  console.log("isProtectedRoute ", isProtectedRoute);
  console.log("isAuthRoute ", isAuthRoute);

  // 3. Redirect: Unauthenticated user trying to access a protected route
  //    → Save the original URL as callbackUrl
  if (!isAuth && isProtectedRoute) {
    const loginUrl = new URL(`/${locale}/auth/candidate/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); //  save where they came from
    return NextResponse.redirect(loginUrl);
  }

  // 4. Redirect: Authenticated user trying to access login pages
  //    → Go back to callbackUrl or fallback to "/"
  if (isAuth && isAuthRoute) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl'); // read it
    const redirectTo = callbackUrl ?? `/${locale}`;
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Allow the request to proceed if no conditions are met
  return NextResponse.next();
}

// Optional: Filter middleware to run only on specific paths for better performance
export const config = {
  matcher: ['/:locale/company/:path*', '/:locale/candidate/:path*', '/:locale/auth/:path*'],
};
