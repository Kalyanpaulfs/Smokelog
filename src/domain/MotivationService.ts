import { ClockService } from './ClockService';

export interface MotivationMessage {
  id: string;
  category: 'Health' | 'Time' | 'Financial';
  content: string;
}

const MESSAGES: MotivationMessage[] = [
  { id: '1', category: 'Health', content: 'Cravings only last 10 minutes. Hit Cancel, put your phone down, and just wait it out.' },
  { id: '2', category: 'Time', content: 'Do not break your streak for a 5-minute urge. You are stronger than this. Cancel it.' },
  { id: '3', category: 'Financial', content: 'Think of the money you are saving. Is this really worth paying for? Hit Cancel.' },
  { id: '4', category: 'Health', content: 'Your lungs are actively healing right now. Do not interrupt the process. Just wait 10 minutes.' },
  { id: '5', category: 'Time', content: 'You opened this app to hold yourself accountable. Prove it to yourself. Press Cancel.' },
  { id: '6', category: 'Health', content: 'Breathe in deeply for 5 seconds. Breathe out. Now press Cancel and walk away.' },
  { id: '7', category: 'Time', content: 'You can always do it later. But for right now, just say no. Hit Cancel.' },
];

/**
 * Pure domain service for rotating motivation deterministically.
 */
export const MotivationService = {
  getRandomMotivation: (): MotivationMessage => {
    const randomIndex = Math.floor(Math.random() * MESSAGES.length);
    return MESSAGES[randomIndex];
  }
};
