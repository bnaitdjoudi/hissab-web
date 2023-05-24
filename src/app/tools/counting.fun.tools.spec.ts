import {
  deleteOpBalanceFunMap,
  functionMap,
  localBalanceFunMap,
} from './counting.fun.tools';

describe('CountingFunTools', () => {
  it('functionMap ', () => {
    let fun = functionMap['actif'];
    expect(fun).toBeTruthy();
    if (fun) expect(fun(400, 0, 20)).toEqual(420);

    fun = functionMap['passif'];
    expect(fun).toBeTruthy();
    if (fun) expect(fun(0, 400, 900)).toEqual(500);

    fun = functionMap['passif'];
    expect(fun).toBeTruthy();
    if (fun) expect(fun(0, 400, 0)).toEqual(-400);
  });

  it('localBalanceFunMap ', () => {
    Object.keys(localBalanceFunMap).forEach((el) => {
      expect(localBalanceFunMap[el](400, 200)).toEqual(200);
    });
  });

  it('deleteOpBalanceFunMap ', () => {
    Object.keys(deleteOpBalanceFunMap).forEach((el) => {
      expect(deleteOpBalanceFunMap[el](400, 200)).toEqual(-200);
    });
  });
});
