import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "next_flow_view_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const SESSION_SECRET = "qwertyuiopasdfghjklzxcvbnm1234567890";

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

export const assertSessionSecret = (): string => {
  const secret = SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be configured to use authentication");
  }
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("SESSION_SECRET must be at least 32 bytes long");
  }
  return secret;
};

export const createSession = async (userId: string): Promise<void> => {
  const payload: SessionPayload = {
    userId,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = createHmac("sha256", assertSessionSecret())
    .update(encodedPayload)
    .digest("base64url");

  cookies().set(SESSION_COOKIE, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSession = async (): Promise<void> => {
  cookies().delete(SESSION_COOKIE);
};

export const getSessionUserId = (): string | null => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [encodedPayload, signature, ...extraParts] = token.split(".");
  if (!encodedPayload || !signature || extraParts.length > 0) return null;

  const expectedSignature = createHmac("sha256", assertSessionSecret())
    .update(encodedPayload)
    .digest();
  const suppliedSignature = Buffer.from(signature, "base64url");
  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload.userId;
  } catch {
    return null;
  }
};
