import { MilestoneService } from '../MilestoneService';

describe('MilestoneService', () => {
  it('should return the correct initial progress for 0 ms', () => {
    const result = MilestoneService.calculateMilestoneProgress(0);
    expect(result.currentMilestone).toBeNull();
    expect(result.nextMilestone?.label).toBe('20 minutes');
    expect(result.progress).toBe(0);
    expect(result.remainingTime).toBe(20 * 60 * 1000);
  });

  it('should return correct progress halfway to the first milestone', () => {
    const tenMinutes = 10 * 60 * 1000;
    const result = MilestoneService.calculateMilestoneProgress(tenMinutes);
    expect(result.currentMilestone).toBeNull();
    expect(result.nextMilestone?.label).toBe('20 minutes');
    expect(result.progress).toBe(50);
    expect(result.remainingTime).toBe(10 * 60 * 1000);
  });

  it('should identify hitting the first milestone exactly', () => {
    const twentyMinutes = 20 * 60 * 1000;
    const result = MilestoneService.calculateMilestoneProgress(twentyMinutes);
    expect(result.currentMilestone?.label).toBe('20 minutes');
    expect(result.nextMilestone?.label).toBe('12 hours');
    expect(result.progress).toBe(0); // 0% towards the NEXT milestone
  });

  it('should calculate progress correctly between two milestones', () => {
    const twentyMinutes = 20 * 60 * 1000;
    const twelveHours = 12 * 60 * 60 * 1000;
    const targetDelta = twelveHours - twentyMinutes;
    const halfwayBetween = twentyMinutes + (targetDelta / 2);

    const result = MilestoneService.calculateMilestoneProgress(halfwayBetween);
    expect(result.currentMilestone?.label).toBe('20 minutes');
    expect(result.nextMilestone?.label).toBe('12 hours');
    expect(result.progress).toBe(50);
    expect(result.remainingTime).toBe(targetDelta / 2);
  });

  it('should cap progress at 100% and nullify nextMilestone when all are reached', () => {
    // Over 1 month (the last milestone)
    const twoMonths = 60 * 24 * 60 * 60 * 1000;
    const result = MilestoneService.calculateMilestoneProgress(twoMonths);
    expect(result.currentMilestone?.label).toBe('1 month');
    expect(result.nextMilestone).toBeNull();
    expect(result.progress).toBe(100);
    expect(result.remainingTime).toBe(0);
  });
});
