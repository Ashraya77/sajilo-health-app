export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: unknown;
  error?: unknown;
};

export type ApiResponse<T> = T | ApiEnvelope<T>;

export type ApiCollection<T> =
  | readonly T[]
  | {
      results: readonly T[];
      count?: number;
      next?: string | null;
      previous?: string | null;
    };

function isApiArray<T>(collection: ApiCollection<T>): collection is readonly T[] {
  return Array.isArray(collection);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiEnvelope<T>(value: ApiResponse<T>): value is ApiEnvelope<T> {
  return (
    isRecord(value)
    && typeof value.success === 'boolean'
    && Object.prototype.hasOwnProperty.call(value, 'data')
  );
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (isRecord(error) && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return 'The server could not complete the request.';
}

/** Normalizes the standard API envelope while preserving raw legacy serializer responses. */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!isApiEnvelope(response)) {
    return response;
  }

  if (!response.success) {
    throw new Error(getErrorMessage(response.error));
  }

  return response.data;
}

/** Normalizes raw arrays and legacy DRF paginated collections to a plain array. */
export function normalizeApiCollection<T>(collection: ApiCollection<T>): T[] {
  return isApiArray(collection) ? [...collection] : [...collection.results];
}
