import getAccessProviderContent from '../getAccessProviderContent';

describe('getAccessProviderContent', () => {
  it('should return content string when call getAccessProviderContent', () => {
    const result = getAccessProviderContent();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
