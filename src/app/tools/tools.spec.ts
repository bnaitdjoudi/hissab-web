import { pathToAllParentUniquePath } from './tools';

describe('Tools', () => {
  it('pathToAllParentUniquePath should return list ', () => {
    expect(pathToAllParentUniquePath('1/2/3/3/4')).toEqual([
      '1/2/3/3/4',
      '1/2/3/3',
      '1/2/3',
      '1/2',
      '1',
    ]);
  });
});
