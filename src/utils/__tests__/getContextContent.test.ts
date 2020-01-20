import getContextContent from '../getContextContent';

describe('getContextContent', () => {
  it('should return content string when call getContextContent', () => {
    const result = getContextContent();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
