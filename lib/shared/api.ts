import { NextResponse } from "next/server";
import { DomainError, ValidationError } from "./errors";
import { ZodError } from "zod";

/**
 * Wraps an API route handler. Translates domain errors to HTTP responses
 * so business logic in lib/ stays HTTP-agnostic.
 */
export function apiHandler<T>(
  fn: () => Promise<T>,
): Promise<NextResponse> {
  return fn()
    .then((data) =>
      NextResponse.json(data ?? { ok: true }, { status: 200 }),
    )
    .catch((err) => {
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            issues: err.flatten(),
          },
          { status: 400 },
        );
      }
      if (err instanceof DomainError) {
        return NextResponse.json(
          {
            error: err.message,
            code: err.code,
            ...(err instanceof ValidationError && err.issues
              ? { issues: err.issues }
              : {}),
          },
          { status: err.httpStatus },
        );
      }
      console.error("[API] Unhandled error:", err);
      return NextResponse.json(
        { error: "Something went wrong on our end" },
        { status: 500 },
      );
    });
}
