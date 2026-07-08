import { ClockService } from '../ClockService';

describe('ClockService', () => {
  it('should return the current timestamp', () => {
    // Spy on global Date.now
    const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1600000000000);
    
    expect(ClockService.now()).toBe(1600000000000);
    expect(dateSpy).toHaveBeenCalled();
    
    dateSpy.mockRestore();
  });
});
