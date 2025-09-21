// // lib/auth.ts
// import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { JWT } from "next-auth/jwt";
// import { Session } from "next-auth";

// // Extend the built-in session types
// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string;
//             email: string;
//             name: string;
//             image?: string | null;
//         };
//         accessToken?: string;
//     }

//     interface User {
//         id: string;
//         email: string;
//         name: string;
//         image?: string | null;
//         accessToken?: string;
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         id: string;
//         accessToken?: string;
//     }
// }

// // Custom user type for our API response
// interface ApiUser {
//     id: string;
//     email: string;
//     name: string;
//     image?: string | null;
//     role: string;
//     createdAt: string;
//     lastLogin: string | null;
//     preferences: {
//         dietaryRestrictions: string[];
//         allergies: string[];
//         favoriteCategories: string[];
//     };
// }

// interface ApiResponse {
//     token: string;
//     user: ApiUser;
//     message: string;
// }

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials): Promise<NextAuthUser | null> {
//                 if (!credentials?.email || !credentials.password) {
//                     return null;
//                 }

//                 try {
//                     // Call your backend API
//                     const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({
//                             email: credentials.email,
//                             password: credentials.password,
//                         }),
//                     });

//                     if (!res.ok) {
//                         console.error("Login failed:", await res.text());
//                         return null;
//                     }

//                     const data: ApiResponse = await res.json();

//                     // Return user object for NextAuth
//                     if (data?.user && data?.token) {
//                         return {
//                             id: data.user.id,
//                             email: data.user.email,
//                             name: data.user.name,
//                             image: data.user.image,
//                             accessToken: data.token,
//                         };
//                     }

//                     return null;
//                 } catch (error) {
//                     console.error("Auth error:", error);
//                     return null;
//                 }
//             },
//         }),

//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//     ],

//     session: {
//         strategy: "jwt",
//     },

//     callbacks: {
//         async jwt({ token, user }): Promise<JWT> {
//             // Persist the OAuth access_token and or the user id to the token right after signin
//             if (user) {
//                 token.id = user.id;
//                 token.accessToken = user.accessToken;
//             }
//             return token;
//         },

//         async session({ session, token }): Promise<Session> {
//             // Send properties to the client, like an access_token and user id from a provider
//             if (session.user && token) {
//                 session.user.id = token.id;
//                 session.accessToken = token.accessToken;
//             }
//             return session;
//         },

//         async signIn({ user, account, profile }) {
//             // Handle Google OAuth signin
//             if (account?.provider === "google" && profile?.email) {
//                 // You can add logic here to handle Google users
//                 // For now, we'll allow all Google signins
//                 return true;
//             }

//             // For credentials provider
//             return user ? true : false;
//         },
//     },

//     pages: {
//         signIn: "/login",
//         error: "/login",
//     },

//     debug: process.env.NODE_ENV === "development",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };