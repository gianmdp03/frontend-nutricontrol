// middleware.ts (En la RAÍZ de tu proyecto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {jwtDecode} from 'jwt-decode';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Si no tiene token y está intentando entrar a CUALQUIER ruta protegida por el matcher
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 2. Decodificamos el token
    const decodedToken: any = jwtDecode(token);
    
    // Normalizamos el rol (Depende de cómo lo envíe tu Spring Boot, probamos las dos formas comunes)
    const userRole = decodedToken.role || 
                    (decodedToken.authorities && decodedToken.authorities[0]) || 
                    '';

    // ----------------------------------------------------------------
    // REGLAS DE ACCESO PARA ADMIN (Doctora)
    // ----------------------------------------------------------------
    if (pathname.startsWith('/admin') || pathname.startsWith('/backoffice')) {
      if (userRole !== 'ROLE_ADMIN') {
        // Si un paciente intenta entrar al backoffice, lo pateamos a la home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // ----------------------------------------------------------------
    // REGLAS DE ACCESO PARA PACIENTES
    // ----------------------------------------------------------------
    // Definí acá todas las rutas que son EXCLUSIVAS del paciente
    const isPatientRoute = pathname.startsWith('/mis-turnos') || 
                           pathname.startsWith('/perfil') || 
                           pathname.startsWith('/paciente');

    if (isPatientRoute) {
      if (userRole !== 'ROLE_PATIENT') {
        // Si la doctora intenta entrar al perfil de un paciente desde una URL directa, la pateamos al backoffice
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }

    // 3. Si tiene token y el rol coincide con la ruta, ¡adentro!
    return NextResponse.next();

  } catch (error) {
    // Si el token fue modificado a mano en el navegador o explotó
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// 4. El Config Matcher: Acá le decís a Next.js qué rutas vigilar
export const config = {
  matcher: [
    /*
     * Vigila todas las rutas de Admin
     */
    '/admin/:path*',
    '/backoffice/:path*',
    
    /*
     * Vigila todas las rutas de Paciente
     */
    '/mis-turnos/:path*',
    '/perfil/:path*',
    '/paciente/:path*'
  ],
};