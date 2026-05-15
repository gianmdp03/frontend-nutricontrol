import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Si intenta entrar a /admin y no es ADMIN, lo pateamos a la página de inicio
    if (path.startsWith("/admin") && token?.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Aquí puedes agregar más reglas, por ejemplo, si tienes rutas que solo los PACIENTES pueden ver
  },
  {
    callbacks: {
      // Esta función exige que haya un token (es decir, que el usuario esté logueado)
      // para acceder a las rutas protegidas definidas en el 'matcher'
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  // Aquí pones todas las rutas que REQUIEREN estar logueado para entrar.
  // El :path* significa "cualquier subruta dentro de admin", ej: /admin/usuarios
  matcher: [
    "/admin/:path*",
    "/appointments/:path*", // Asumiendo que sacar turnos requiere login
    // Agrega aquí otras rutas que quieras proteger
  ],
};
