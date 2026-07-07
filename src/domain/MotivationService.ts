import { ClockService } from './ClockService';

export interface MotivationMessage {
  id: string;
  category: 'Health' | 'Time' | 'Financial';
  content: string;
}

const MESSAGES: MotivationMessage[] = [
  { id: '1', category: 'Health', content: 'Your body is beginning to heal itself. Keep breathing.' },
  { id: '2', category: 'Time', content: 'Every minute free is a victory. Protect your progress.' },
  { id: '3', category: 'Financial', content: 'You are saving money and investing in your future.' },
  { id: '4', category: 'Health', content: 'Your energy levels will naturally begin to stabilize soon.' },
  { id: '5', category: 'Time', content: 'You are regaining control of your day, one choice at a time.' },
  { id: '6', category: 'Health', content: 'Your senses are sharpening. Enjoy the clarity.' },
  { id: '7', category: 'Time', content: 'You have given yourself the gift of time. Use it well.' },
];

/**
 * Pure domain service for rotating motivation deterministically.
 */
export const MotivationService = {
  getMotivation: (firstLogTimestamp?: number): MotivationMessage | null => {
    if (!firstLogTimestamp) return null;
    
    const now = ClockService.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    // Ensure we don't go negative if clocks are tampered with
    const elapsedMs = Math.max(0, now - firstLogTimestamp);
    
    // Calculate days since the very first log
    const daysSinceFirstLog = Math.floor(elapsedMs / msPerDay);
    
    // Deterministic modulo rotation ensures predictability and tests correctly
    const index = daysSinceFirstLog % MESSAGES.length;
    
    return MESSAGES[index];
  }
};
