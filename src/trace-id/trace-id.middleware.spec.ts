import { TraceIdMiddleware } from './trace-id.middleware';

describe('TraceIdMiddleware', () => {
  it('should be defined', () => {
    expect(new TraceIdMiddleware()).toBeDefined();
  });
});
