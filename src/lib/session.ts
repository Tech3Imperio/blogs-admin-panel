"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
  } catch (error) {
    console.error("JWT encryption failed:", error);
    throw error;
  }
}

export async function decrypt(session: string | undefined = "") {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();
  console.log(session);
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function refreshSession(token: string): Promise<string | null> {
  try {
    // Verify the current token
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    // Check if token needs refresh (e.g., if it's close to expiring)
    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);

    // If token expires in less than 1 day, refresh it
    if (exp - now < 60 * 60 * 24) {
      // Create a new token with the same payload but new expiration
      return await encrypt(payload as unknown as SessionPayload);
    }

    // Token is still valid and not close to expiring
    return token;
  } catch (error) {
    console.error("Session refresh failed:", error);
    return null;
  }
}
