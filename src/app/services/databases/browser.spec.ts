describe('browser browserDBInstance', () => {
  it('db call transaction', () => {
    let trans: any;
    let dbSpy = {
      transaction: jasmine.createSpy('transaction').and.callFake((arg: any) => {
        trans = arg;
      }),
    };

    let rx = {
      
    }
  });
});
