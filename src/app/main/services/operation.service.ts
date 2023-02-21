import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { format } from 'date-fns';
import { resolve } from 'dns';
import { Operation } from '../model/operation.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import {
  deleteOpBalanceFunMap,
  functionMap,
  localBalanceFunMap,
} from '../tools/counting.fun.tools';
import { printError } from '../tools/errorTools';
import { pathToAllParentUniquePath } from '../tools/tools';
import { AccountingService } from './accounting.service';
import { AccountsService } from './accounts.service';
import { OperationDataBase } from './databases/operation.db';

@Injectable()
export class OperationService {
  constructor(
    private readonly operationDb: OperationDataBase,
    private readonly accountService: AccountsService,
    private accountingService: AccountingService
  ) {}

  async createOperation(operation: Operation): Promise<any> {
    return this.operationDb.create(operation);
  }

  async createOperations(operations: Operation[]): Promise<any> {
    return this.operationDb.createList(operations);
  }

  async getOperationsByAccountId(id: number): Promise<Operation[]> {
    return this.operationDb.findByIdAccount(id);
  }

  async updateOperation(operation: Operation, id: number): Promise<Operation> {
    return this.operationDb.update(operation, id);
  }

  async getOperationById(id: number): Promise<Operation> {
    return this.operationDb.findById(id);
  }

  async getOperationJoinAccountById(id: number): Promise<Operation> {
    return new Promise(async (resolve, reject) => {
      this.operationDb
        .selectOperationJoinAccountById(id)
        .then((op) => {
          resolve(op);
        })
        .catch((err) => {
          reject('erreur dans lappel a la bd');
          console.error(err);
        });
    });
  }

  async getOperationsByPagingAndAccountId(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Operation>> {
    return this.operationDb.findByIdAccountAndPaging(paging, id);
  }

  async adjusteAfterOperation(
    id: number,
    countId: number,
    diff: number
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.operationDb
        .adjusteAfterOperation(id, countId, diff)
        .then(() => {
          this.accountService.getAccountById(countId).then((account) => {
            this.accountService
              .updateTotalByAccountPath(
                [...pathToAllParentUniquePath(account.path)],
                diff
              )
              .then(() => resolve(null))
              .catch((err) => reject(err));
          });
        })
        .catch((err) => reject(err));
    });
  }

  async adjusteAfterOperationByDate(
    date: Date | string,
    countId: number,
    diff: number
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.operationDb
        .adjusteAfterOperationByDate(date, countId, diff)
        .then(() => {
          this.accountService.getAccountById(countId).then((account) => {
            this.accountService
              .updateTotalByAccountPath(
                [...pathToAllParentUniquePath(account.path)],
                diff
              )
              .then(() => resolve(null))
              .catch((err) => reject(err));
          });
        })
        .catch((err: any) => reject(err));
    });
  }

  async getBalanceBeforeDate(date: Date, accountId: number): Promise<number> {
    return new Promise<number>(async (resolve, rejects) => {
      try {
        let balance: number = await this.operationDb.getBalanceBeforeDate(
          date,
          accountId
        );
        resolve(balance);
      } catch (err) {
        printError(
          'erreur en recuperant la balance a la date ' + accountId,
          rejects,
          err
        );
      }
    });
  }

  async businessCreationOperationDate(
    operationS: Operation
  ): Promise<Operation> {
    return new Promise<Operation>((resolve, reject) => {
      this.accountService
        .getAccountById(operationS.idAccount)
        .then((accountS) => {
          this.accountService
            .findAccountByPath(operationS.transfer)
            .then(async (accountD) => {
              let operationD: Operation =
                this.accountingService.processTransferingOperation(
                  accountS.type + '->' + accountD.type,
                  operationS
                );

              operationD.transfer = accountS.path;
              operationS.transfer = accountD.path;

              operationD.idAccount = accountD.id;
              operationS.idAccount = accountS.id;

              try {
                let balanceS = await this.getBalanceBeforeDate(
                  operationS.time,
                  operationS.idAccount
                );

                let balanceD = await this.getBalanceBeforeDate(
                  operationD.time,
                  operationD.idAccount
                );

                operationD.balance =
                  operationD.debit + balanceD - operationD.credit;
                operationS.balance =
                  balanceS + operationS.debit - operationS.credit;
                let operations = [operationD, operationS];
                this.operationDb
                  .createList(operations)
                  .then(() => {
                    Promise.all(
                      operations.map((op) =>
                        this.adjusteAfterOperationByDate(
                          op.time,
                          op.idAccount,
                          op.debit - op.credit
                        )
                      )
                    )
                      .then(() => {
                        resolve(operationS);
                      })
                      .catch((err) =>
                        printError('erreur durant la ajustement', reject, err)
                      );
                  })
                  .catch((err) =>
                    printError(
                      'erreur durant lajout de loperation',
                      reject,
                      err
                    )
                  );
              } catch (error) {
                printError(
                  'erreur dans la recuperation de la balance',
                  reject,
                  error
                );
              }
            });
        });
    });
  }

  async deleteOperationDate(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.operationDb
        .findById(id)
        .then((operation) => {
          if (operation && operation.id !== undefined) {
            this.operationDb
              .selectOperationJoinAccountByNumTrans(operation.numTrans)
              .then((operations) => {
                this.operationDb
                  .deleteById(operations.map((op) => op.id))
                  .then(() => {
                    Promise.all(
                      operations.map((op) => {
                        let diff = deleteOpBalanceFunMap[
                          op.accountType ? op.accountType : 'actif'
                        ](op.debit, op.credit);
                        return this.adjusteAfterOperationByDate(
                          format(op.time, 'yyyy-MM-dd HH:mm:ss'),
                          op.idAccount,
                          diff
                        );
                      })
                    )
                      .then(() => resolve())
                      .catch((err) => reject(err));
                  });
              });
          } else {
            reject('operation non retrouvée');
          }
        })
        .catch((err) => reject(err));
    });
  }

  async businessUpdateOperationDate(operationM: Operation): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.deleteOperationDate(operationM.id).then(() => {
        this.businessCreationOperationDate(operationM)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject('erreur lors de la creation de l operation');
            console.error(err);
          })
          .catch((err) => {
            reject('erreur lors de la suppression de l operation');
            console.error(err);
          });
      });
    });
  }
}
