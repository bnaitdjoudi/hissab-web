import { Injectable } from '@angular/core';
import { Operation } from '../model/operation.model';

const noChangeTransfer = (operation: Operation): Operation => {
  let op: Operation = { ...operation };
  return op;
};

const debitCreditInverseTransfer = (operation: Operation): Operation => {
  let op: Operation = {
    ...operation,
    debit: operation.credit,
    credit: operation.debit,
  };
  return op;
};

const mapTransferFunc = new Map<string, (operation: Operation) => Operation>();

mapTransferFunc.set('income->actif', noChangeTransfer); // ok
mapTransferFunc.set('actif->income', noChangeTransfer); // ok
mapTransferFunc.set('passif->actif', debitCreditInverseTransfer); // ok
mapTransferFunc.set('actif->passif', debitCreditInverseTransfer); // ok
mapTransferFunc.set('actif->depense', noChangeTransfer); // ok
mapTransferFunc.set('depense->actif', noChangeTransfer); // ok
mapTransferFunc.set('depense->passif', noChangeTransfer); // ok
mapTransferFunc.set('passif->depense', noChangeTransfer); // ok
mapTransferFunc.set('depense->income', debitCreditInverseTransfer); //ok
mapTransferFunc.set('income->depense', debitCreditInverseTransfer); // ok
mapTransferFunc.set('passif->income', noChangeTransfer); // ok
mapTransferFunc.set('income->passif', noChangeTransfer); // ok

mapTransferFunc.set('income->balance', noChangeTransfer); // ok
mapTransferFunc.set('passif->balance', noChangeTransfer); // ok
mapTransferFunc.set('actif->balance', noChangeTransfer); // ok
mapTransferFunc.set('depense->balance', noChangeTransfer); // ok

mapTransferFunc.set('actif->actif', debitCreditInverseTransfer); // ok

@Injectable()
export class AccountingService {
  constructor() {}

  processTransferingOperation(
    tranfer: string,
    operation: Operation
  ): Operation {
    let transferFun = mapTransferFunc.get(tranfer);
    return transferFun !== undefined ? transferFun(operation) : operation;
  }
}
