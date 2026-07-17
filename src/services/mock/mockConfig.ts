export const mockConfig = {
  simulateLatency: true,
  minDelayMs: 300,
  maxDelayMs: 800,
  simulateErrors: false,
  errorRate: 0.05
};

export function getRandomDelay(): number {
  const { minDelayMs, maxDelayMs } = mockConfig;
  return Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
}
