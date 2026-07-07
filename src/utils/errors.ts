export const reportError = (error: unknown, context?: string): void => {
  // In a production app, this would send errors to a service like Sentry or Crashlytics.
  // In a production app, this would integrate with Sentry or similar crash reporting.
  // For security and privacy, we do not log to the console.
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
