/**
 * Domain-level errors. Thrown from lib/<domain>/* and caught at API/page boundary.
 * Lets us write business logic without thinking about HTTP — the boundary translates.
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number = 400,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(`${entity} not found`, "NOT_FOUND", 404);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "You must be signed in") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "You don't have access to this") {
    super(message, "FORBIDDEN", 403);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, public issues?: unknown) {
    super(message, "VALIDATION_FAILED", 400);
  }
}

export class CapacityExceededError extends DomainError {
  constructor(remaining: number) {
    super(
      `Only ${remaining} seats left on this tour`,
      "CAPACITY_EXCEEDED",
      409,
    );
  }
}
