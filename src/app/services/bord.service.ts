import { Injectable } from '@angular/core';
import { OperationService } from './operation.service';
import { BalanceRequest, BalanceResult } from '../model/balance.model';
import { resolve } from 'cypress/types/bluebird';
import { printError } from '../tools/errorTools';
import {
  getDatesByPeriodValue,
  getFirstSecondOfMonth,
  getFirstSecondOfYear,
} from '../tools/date.tools';

@Injectable()
export class BordService {
  constructor(private readonly operationService: OperationService) {}

  async getBalanceByPeriod(request: BalanceRequest): Promise<BalanceResult> {
    return new Promise<BalanceResult>(async (resolve, reject) => {
      switch (request.type) {
        case 'global': {
          try {
            let balance: number =
              await this.operationService.getGlobalBalance();
            resolve({ period: request.type, result: balance ? balance : 0 });
          } catch (e) {
            printError('erreur dans le global request', reject, e);
          }
          break;
        }

        case 'month': {
          try {
            let now = new Date();
            let balance: number =
              await this.operationService.getGlobalBalanceBetweenDate(
                now,
                getFirstSecondOfMonth()
              );
            resolve({ period: request.type, result: balance });
          } catch (e) {
            printError('erreur dans le global request', reject, e);
          }
          break;
        }

        case 'cyear': {
          try {
            let now = new Date();
            let balance: number =
              await this.operationService.getGlobalBalanceBetweenDate(
                now,
                getFirstSecondOfYear()
              );
            resolve({ period: request.type, result: balance });
          } catch (e) {
            printError('erreur dans le global request', reject, e);
          }
          break;
        }
      }
    });
  }

  async getBalanceByPeriodAndType(
    request: BalanceRequest,
    accountType: string
  ): Promise<BalanceResult> {
    return new Promise<BalanceResult>(async (resolve, reject) => {
      switch (request.type) {
        case 'month': {
          try {
            let now = new Date();
            let balance: number =
              await this.operationService.getGlobalBalanceAccountBetweenDate(
                now,
                getFirstSecondOfMonth(),
                accountType
              );
            resolve({
              type: accountType,
              result: balance,
              period: request.type,
            });
          } catch (e) {
            printError('erreur dans le global request', reject, e);
          }
          break;
        }
        case 'global':
        case 'cyear': {
          try {
            let [d1, d2] = getDatesByPeriodValue(request.type);
            let balance: number =
              await this.operationService.getGlobalBalanceAccountBetweenDate(
                d2,
                d1,
                accountType
              );
            resolve({
              type: accountType,
              result: balance,
              period: request.type,
            });
          } catch (e) {
            printError('erreur dans le global request', reject, e);
          }
          break;
        }

        default: {
          resolve({ type: '', result: 0, period: request.type });
        }
      }
    });
  }
}
