import { FinancesPipe } from './finances.pipe';

describe('FinancesPipe', () => {
  it('create an instance', () => {
    const pipe = new FinancesPipe();
    expect(pipe).toBeTruthy();
  });
});
