import { Operation } from '../model/operation.model';
import { AccountingService } from './accounting.service';

describe('AccountingService', () => {
  it('AccountingService processTransferingOperation noChangeTransfer', () => {
    let accountingService: AccountingService = new AccountingService();
    let operation: Operation = {
      id: 0,
      balance: 0,
      credit: 100,
      debit: 0,
      idAccount: 0,
      description: '',
      statut: 'r',
      time: new Date(),
      numTrans: '',
      transfer: '',
    };

    let op = accountingService.processTransferingOperation(
      'income->actif',
      operation
    );

    expect(op).toEqual(operation);
  });

  it('AccountingService processTransferingOperation debitCreditInverseTransfer', () => {
    let accountingService: AccountingService = new AccountingService();
    let operation: Operation = {
      id: 0,
      balance: 0,
      credit: 100,
      debit: 0,
      idAccount: 0,
      description: '',
      statut: 'r',
      time: new Date(),
      numTrans: '',
      transfer: '',
    };

    let op = accountingService.processTransferingOperation(
      'passif->actif',
      operation
    );

    expect(op.credit).toEqual(operation.debit);
    expect(op.debit).toEqual(operation.credit);
  });

  it('AccountingService processTransferingOperation no function', () => {
    let accountingService: AccountingService = new AccountingService();
    let operation: Operation = {
      id: 0,
      balance: 0,
      credit: 100,
      debit: 0,
      idAccount: 0,
      description: '',
      statut: 'r',
      time: new Date(),
      numTrans: '',
      transfer: '',
    };

    let op = accountingService.processTransferingOperation('d', operation);

    expect(op).toEqual(operation);
  });
});
