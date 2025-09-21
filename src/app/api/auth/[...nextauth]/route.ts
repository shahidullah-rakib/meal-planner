// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Extend NextAuth types
declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string;
        accessToken?: string;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        accessToken?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                // 🔹 Call your backend API (or check DB directly)
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                if (!res.ok) return null;

                const data = await res.json();

                // Must return user object or null
                if (data?.user && data?.token) {
                    return {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        accessToken: data.token, // 🔑 store token for later
                    };
                }

                return null;
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

