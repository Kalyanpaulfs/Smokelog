export interface Milestone {
  label: string;
  description: string;
  thresholdMs: number;
}

export interface MilestoneProgress {
  currentMilestone: Milestone | null;
  nextMilestone: Milestone | null;
  /** Percentage completed towards the next milestone (0 - 100) */
  progress: number; 
  /** Time remaining in milliseconds until next milestone is hit */
  remainingTime: number; 
}

const MILESTONES: Milestone[] = [
  { label: '20 minutes', description: 'Your heart rate and blood pressure will drop back to normal levels.', thresholdMs: 20 * 60 * 1000 },
  { label: '12 hours', description: 'Carbon monoxide levels in your blood will drop to normal.', thresholdMs: 12 * 60 * 60 * 1000 },
  { label: '24 hours', description: 'Your risk of having a heart attack will begin to drop.', thresholdMs: 24 * 60 * 60 * 1000 },
  { label: '48 hours', description: 'Nerve endings will begin to regrow. Your sense of smell and taste will improve.', thresholdMs: 48 * 60 * 60 * 1000 },
  { label: '72 hours', description: 'Your bronchial tubes will relax, making breathing significantly easier.', thresholdMs: 72 * 60 * 60 * 1000 },
  { label: '1 week', description: 'Your blood circulation will improve. Walking will become much easier.', thresholdMs: 7 * 24 * 60 * 60 * 1000 },
  { label: '2 weeks', description: 'Your overall lung function will improve by up to 30%.', thresholdMs: 14 * 24 * 60 * 60 * 1000 },
  { label: '1 month', description: 'Coughing and shortness of breath will decrease as your energy levels surge.', thresholdMs: 30 * 24 * 60 * 60 * 1000 },
];

/**
 * Domain service mapping elapsed time to significant health recovery milestones.
 */
export const MilestoneService = {
  calculateMilestoneProgress: (elapsedMs: number): MilestoneProgress => {
    let current: Milestone | null = null;
    let next: Milestone | null = null;

    // Ordered iteration to find the bounds of the current elapsed time
    for (let i = 0; i < MILESTONES.length; i++) {
      if (elapsedMs >= MILESTONES[i].thresholdMs) {
        current = MILESTONES[i];
      } else {
        next = MILESTONES[i];
        break;
      }
    }

    // If they've surpassed the final milestone
    if (!next) {
      return {
        currentMilestone: current,
        nextMilestone: null,
        progress: 100,
        remainingTime: 0,
      };
    }

    const previousThreshold = current ? current.thresholdMs : 0;
    const targetDelta = next.thresholdMs - previousThreshold;
    const elapsedDelta = elapsedMs - previousThreshold;
    
    // Prevent mathematical errors if elapsedMs somehow goes negative
    const safeElapsedDelta = Math.max(0, elapsedDelta);

    const progress = Math.min(100, Math.max(0, (safeElapsedDelta / targetDelta) * 100));
    const remainingTime = Math.max(0, next.thresholdMs - elapsedMs);

    return {
      currentMilestone: current,
      nextMilestone: next,
      progress,
      remainingTime,
    };
  }
};
