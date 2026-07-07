/**
 * Base domain error for all business logic failures.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * Thrown when validation rules are violated.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the persistence layer fails to read/write/parse.
 */
export class StorageError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}
