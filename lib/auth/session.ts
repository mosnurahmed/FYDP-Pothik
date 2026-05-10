import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";
import { authOptions } from "./options";
import { ForbiddenError, UnauthorizedError } from "../shared/errors";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

/**
 * Server-side session accessor. Returns null if not signed in.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: (session.user as any).id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: (session.user as any).role,
  };
}

/**
 * Throws UnauthorizedError if not signed in. Use in protected routes/pages.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

/**
 * Throws ForbiddenError if not an ADMIN. Future roles (TOUR_LEADER etc.)
 * can be allowed by passing an explicit list.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}

/**
 * Generic role gate. Future-proof for richer RBAC.
 */
export async function requireRole(...allowed: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    throw new ForbiddenError();
  }
  return user;
}
