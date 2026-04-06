import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthSessionUser } from "./shared/types";
import { apiFetch, ApiFetchResponse } from "./shared/lib/fetch-manager";

type AuthRole = "candidate" | "employer";

function extractToken(payload: ApiFetchResponse | null) {
  const data = payload?.data as Record<string, unknown> | undefined;

  return (
    (typeof payload?.token === "string" && payload.token) ||
    (typeof payload?.access_token === "string" && payload.access_token) ||
    (typeof data?.token === "string" && data.token) ||
    (typeof data?.access_token === "string" && data.access_token) ||
    null
  );
}

function extractUser(payload: ApiFetchResponse | null) {
  const data = payload?.data as Record<string, unknown> | undefined;
  const candidates = [
    data?.user,
    data?.profile,
    data?.company,
    data?.employer,
    data,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && "id" in candidate) {
      return candidate as AuthSessionUser;
    }
  }

  return null;
}

async function fetchProfile(baseUrl: string, token: string, locale: string) {
  const { ok, data: profileData } = await apiFetch(
    `${baseUrl}/auth/profile`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    return null;
  }

  return extractUser(profileData);
}

async function authorizeWithEndpoint({
  credentials,
  baseUrl,
  role,
}: {
  credentials?: Record<string, string>;
  baseUrl?: string;
  role: AuthRole;
}) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required.");
  }

  if (!baseUrl) {
    throw new Error("Authentication endpoint is not configured.");
  }

  const formData = new FormData();
  formData.append("email", credentials.email);
  formData.append("password", credentials.password);

  const { data, ok, message } = await apiFetch(`${baseUrl}/auth/login`, {
    method: "POST",
    locale: credentials.locale ?? "en",
    body: formData,
  });
  const errorMessage = message || "Invalid email or password.";
  const accessToken = extractToken(data);
  const loginUser = extractUser(data);

  if (!ok || !accessToken) {
    throw new Error(errorMessage);
  }

  const user =
    loginUser ??
    (await fetchProfile(baseUrl, accessToken, credentials.locale ?? "en"));

  if (!user?.id) {
    throw new Error("Login succeeded but profile data could not be loaded.");
  }

  return {
    id: String(user.id),
    user,
    accessToken,
    authRole: role,
    authMessage: data?.message ?? "Login successful.",
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/en/auth/candidate/login",
  },
  providers: [
    Credentials({
      id: "candidate-credentials",
      name: "Candidate Credentials",
      credentials: {
        email: {},
        password: {},
        locale: {},
      },
      async authorize(credentials) {
        return authorizeWithEndpoint({
          credentials,
          baseUrl: process.env.NEXT_PUBLIC_BASE_USER_URL,
          role: "candidate",
        });
      },
    }),
    Credentials({
      id: "employer-credentials",
      name: "Employer Credentials",
      credentials: {
        email: {},
        password: {},
        locale: {},
      },
      async authorize(credentials) {
        return authorizeWithEndpoint({
          credentials,
          baseUrl: process.env.NEXT_PUBLIC_BASE_COMPANY_URL,
          role: "employer",
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.authRole = user.authRole;
        token.authMessage = user.authMessage;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user ?? session.user;
      session.accessToken = token.accessToken ?? "";
      session.authRole = token.authRole;
      session.authMessage = token.authMessage;

      if (session.user && token.id) {
        session.user.id = Number(token.id);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
