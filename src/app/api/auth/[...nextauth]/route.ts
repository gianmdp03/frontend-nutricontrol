import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "NutriControl",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            },
          );

          const data = await res.json();

          if (res.ok && data.token) {
            return {
              id: data.dto.id.toString(),
              email: data.dto.email || credentials?.email,
              backendToken: data.token,
              role: data.dto.role,
            };
          }
          return null;
        } catch (error) {
          console.error("Error conectando con el backend:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name:
                  (profile as any)?.given_name ||
                  user.name?.split(" ")[0] ||
                  "Paciente",
                lastname:
                  (profile as any)?.family_name ||
                  user.name?.split(" ").slice(1).join(" ") ||
                  "",
                picture: user.image,
              }),
            },
          );

          if (!res.ok) return false;

          const backendData = await res.json();
          user.backendToken = backendData.token;
          user.role = backendData.dto?.role || "PATIENT";
          return true;
        } catch (error) {
          console.error("Error sincronizando Google con Spring Boot", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.backendToken = token.backendToken as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Le decimos que usaremos nuestra propia interfaz de diseño
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas, ajusta según la expiración de tu JWT en Spring Boot
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
