import { printError } from './errorTools';

describe('printError', () => {
  it('printError should message ', () => {
    const reject = jasmine.createSpy('reject').and.callFake((msg: string) => {
      console.info(msg);
    });

    printError('message to !!!', reject, 'erreur');

    expect(reject).toHaveBeenCalledWith('message to !!!');
  });
});
