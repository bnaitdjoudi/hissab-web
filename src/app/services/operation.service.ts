import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Operation } from '../model/operation.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { deleteOpBalanceFunMap } from '../tools/counting.fun.tools';
import { printError } from '../tools/errorTools';
import { pathToAllParentUniquePath } from '../tools/tools';
import { AccountingService } from './accounting.service';
import { AccountsService } from './accounts.service';
import { OperationDataBase } from './databases/operation.db';
import { Period } from '../model/balance.model';
import { getDatesByPeriodValue } from '../tools/date.tools';
import { OperationSearchData } from '../model/operation-page.store.model';
import {
  AccountBalance,
  AccountBalancePeriod,
  AssetAtDateRapport,
} from '../model/rapport-store.model';
import { AssetRapportComponent } from '../pages/rapport/rapport-views/asset-rapport/asset-rapport.component';

@Injectable({
  providedIn: 'root',
})
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
    return this.operationDb.createList(operations, true);
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
    return new Promise((resolve, reject) => {
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
    date: Date,
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
                  .createListIdReturning(operations, false)
                  .then((ids) => {
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
                        operationS.id = ids[1];
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
                          op.time,
                          op.idAccount,
                          diff
                        );
                      })
                    )
                      .then(() => resolve())
                      .catch((err) => reject(err));
                  })
                  .catch((err) =>
                    printError('erreur dans la suppression', reject, err)
                  );
              })
              .catch((err) =>
                printError(
                  'erreur pour retrouver par numero de transaction',
                  reject,
                  err
                )
              );
          } else {
            reject('operation non retrouvée');
          }
        })
        .catch((err) => reject(err));
    });
  }

  async getGlobalBalance(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        let result: number = await this.operationDb.getGlobalBalance();
        resolve(result);
      } catch (error) {
        printError('erreur durant appel du service db', reject, error);
      }
    });
  }

  async getGlobalBalanceBetweenDate(
    endDate: Date,
    startDate: Date
  ): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        let result: number = await this.operationDb.getGlobalBalanceBetweenDate(
          endDate,
          startDate
        );
        resolve(result ? result : 0);
      } catch (error) {
        if (error === 'no result') {
          resolve(0);
        } else {
          printError('getGlobalBalanceBetweenDate', reject, error);
        }
      }
    });
  }

  getGlobalBalanceAccountBetweenDate(
    endDate: Date,
    startDate: Date,
    type: string
  ): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        let result: number =
          await this.operationDb.getGlobalBalanceAccountBetweenDate(
            endDate,
            startDate,
            type
          );
        resolve(result ? result : 0);
      } catch (error) {
        if (error === 'no result') {
          resolve(0);
        } else {
          printError('erreur durant appel du service db kk', reject, error);
        }
      }
    });
  }

  getBalanceOnLeafByTypeAccountAndDates(
    endDate: Date,
    startDate: Date,
    type: string
  ): Promise<AccountBalancePeriod> {
    return new Promise<AccountBalancePeriod>(async (resolve, reject) => {
      try {
        let results: AccountBalance[] =
          await this.operationDb.getBalanceOnLeafByTypeAccountAndDates(
            endDate,
            startDate,
            type
          );
        resolve({
          accountBalance: results,
          periodDates: { end: endDate, start: startDate },
        });
      } catch (error) {
        if (error === 'no result') {
          resolve({
            accountBalance: [],
            periodDates: { end: endDate, start: startDate },
          });
        } else {
          printError('erreur durant appel du service db kk', reject, error);
        }
      }
    });
  }

  getOperationsByPagingAndPeriodAndAccountId(
    paging: PagingRequest,
    id: number,
    period: Period
  ): Promise<PagingData<Operation>> {
    return new Promise<PagingData<Operation>>((resolve, reject) => {
      let [startDate, endDate] = getDatesByPeriodValue(period);

      this.operationDb
        .findByIdAccountAndPagingBetweenDate(
          paging,
          id,
          format(startDate, 'yyyy-MM-dd HH:mm:ss'),
          format(endDate, 'yyyy-MM-dd HH:mm:ss')
        )
        .then((d) => resolve(d))
        .catch((err) =>
          printError(
            'erreur dans getOperationsByPagingAndPeriodAndAccountId',
            reject,
            err
          )
        );
    });
  }

  async businessUpdateOperationDate(operationM: Operation): Promise<Operation> {
    return new Promise<Operation>(async (resolve, reject) => {
      this.deleteOperationDate(operationM.id)
        .then(() => {
          this.businessCreationOperationDate(operationM)
            .then((op) => {
              this.operationDb
                .findOperationByTransAndCountId(op.numTrans, op.idAccount)
                .then((rop) => {
                  resolve(rop);
                })
                .catch((err) => {
                  reject('erreur quand on veut recuperer la operaton');
                  console.error(err);
                });
            })
            .catch((err) => {
              reject('erreur lors de la creation de l operation');
              console.error(err);
            });
        })
        .catch((err) => {
          reject('erreur lors de la suppression de l operation');
          console.error(err);
        });
    });
  }

  async operationSearch(
    operationSerachData: OperationSearchData | undefined
  ): Promise<PagingData<Operation> | undefined> {
    return new Promise<PagingData<Operation> | undefined>(
      async (resolve, reject) => {
        if (operationSerachData) {
          try {
            resolve(
              await this.operationDb.operationSearch(operationSerachData)
            );
          } catch (error) {
            reject("erreur dans l'apelle  a bd");
            console.error(error);
          }
        } else {
          resolve(undefined);
        }
      }
    );
  }

  async getAllYearOperation(idAccount: number): Promise<Operation[]> {
    return new Promise<Operation[]>(async (resolve, reject) => {
      let date = new Date(2023, 1, 1, 0, 0, 1);
      try {
        resolve(
          await this.operationDb.getAllOperationAfterDate(idAccount, date)
        );
      } catch (error) {
        reject('erreur avec la bd');
        console.error(error);
      }
    });
  }

  async getAssetsRapportStateOnDate(date: Date): Promise<AssetAtDateRapport> {
    return new Promise<AssetAtDateRapport>(async (resolve, reject) => {
      try {
        let resp: AssetAtDateRapport = {
          assets: 0,
          liabilities: 0,
          date: date,
        };

        const rActif: Operation =
          await this.operationDb.getActifAndPassifStateOnDateByPath(
            date,
            'actif'
          );
        resp.assets = rActif.debit - rActif.credit;

        const rPassif: Operation =
          await this.operationDb.getActifAndPassifStateOnDateByPath(
            date,
            'passif'
          );
        resp.liabilities = rPassif.credit - rPassif.debit;

        resolve(resp);
      } catch (error) {
        reject('error durant lappel a dao');
        console.error(error);
      }
    });
  }
}
