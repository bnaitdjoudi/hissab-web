import { getNextPeriodDate } from './date.tools';

describe('Tools', () => {
  it('pathToAllParentUniquePath should return list ', () => {
    getNextPeriodDate('2w', new Date(), 2023);
  });
});
