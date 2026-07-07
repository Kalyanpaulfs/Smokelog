import React from 'react';
import { useLiveTimer } from '../../../hooks/use-live-timer';
import { formatElapsedTime } from '../../../utils/time';
import { TimerCard } from './TimerCard';
import { HealthMilestoneCard } from './HealthMilestoneCard';

export interface DashboardTimerContainerProps {
  /** The origin timestamp to track elapsed time from. If missing, renders empty state. */
  timestamp?: number | null;
  /** If the store or parent is currently fetching */
  isLoading?: boolean;
}

/**
 * Smart wrapper isolating the highly frequent 1-second re-renders from the entire Dashboard.
 * Fetches raw milliseconds from the pure TimerEngine via the React hook,
 * formats them, and passes pure strings down to the TimerCard.
 */
export const DashboardTimerContainer: React.FC<DashboardTimerContainerProps> = ({
  timestamp,
  isLoading,
}) => {
  // Drives the 1-second render loop exclusively inside this wrapper
  const { elapsedMilliseconds, hasLog } = useLiveTimer(timestamp);

  // Formatting strictly separated into presentation utility
  const formattedTime = formatElapsedTime(elapsedMilliseconds);

  return (
    <>
      <TimerCard 
        timeSinceLast={formattedTime}
        isEmpty={!hasLog}
        isLoading={isLoading}
      />
      
      {!isLoading && (
        <HealthMilestoneCard 
          elapsedMilliseconds={elapsedMilliseconds}
          isEmpty={!hasLog}
        />
      )}
    </>
  );
};
