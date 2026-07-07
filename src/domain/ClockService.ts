/**
 * A time abstraction service to allow deterministic testing and decouple
 * domain logic from the global Date object.
 */
export const ClockService = {
  /**
   * Returns the current Unix timestamp in milliseconds.
   */
  now: (): number => {
    return Date.now();
  },
};
