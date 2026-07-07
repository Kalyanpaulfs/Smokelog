import * as Crypto from 'expo-crypto';
import { SmokeLog } from './models';
import { SmokeLogRepository } from './SmokeLogRepository';
import { ClockService } from './ClockService';
import { ValidationError, StorageError } from './errors';

export class SmokeLogService {
  private repository: SmokeLogRepository;
  private isProcessing: boolean = false;
  private lastInteractionTime: number = 0;
  private readonly DEBOUNCE_MS = 500;

  constructor(repository: SmokeLogRepository) {
    this.repository = repository;
  }

  /**
   * Logs a new smoke event.
   * Enforces business rules: debouncing, in-flight locks.
   * Returns the newly created SmokeLog.
   * Throws ValidationError or StorageError on failure.
   */
  public async logSmoke(): Promise<SmokeLog> {
    const now = ClockService.now();

    // 1. Debounce (Interaction Protection)
    if (now - this.lastInteractionTime < this.DEBOUNCE_MS) {
      throw new ValidationError('Action blocked: Please wait a moment before tapping again.');
    }
    this.lastInteractionTime = now;

    // 2. In-Flight Lock
    if (this.isProcessing) {
      throw new ValidationError('Action blocked: A log is currently being saved.');
    }
    
    this.isProcessing = true;

    try {
      const log: SmokeLog = {
        id: Crypto.randomUUID(),
        timestamp: now,
      };

      // 3. Persistence
      // If this throws, execution jumps to catch block and fails the flow cleanly.
      await this.repository.saveLog(log);

      return log;
    } catch (error) {
      if (error instanceof StorageError || error instanceof ValidationError) {
        throw error; // Re-throw explicit domain errors
      }
      throw new StorageError(`Unexpected error during log creation: ${(error as Error).message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Retrieves all logs directly from the repository.
   */
  public async getLogs(): Promise<SmokeLog[]> {
    return await this.repository.getLogs();
  }
}
