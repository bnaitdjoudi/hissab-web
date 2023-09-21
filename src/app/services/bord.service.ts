import { Injectable } from '@angular/core';
import { OperationService } from './operation.service';
import { BalanceRequest, BalanceResult } from '../model/balance.model';
import { resolve } from 'cypress/types/bluebird';
import { printError } from '../tools/errorTools';
import {
  getAllendMontDatesInYear,
  getDatesByPeriodValue,
  getDatesOfDayInYear,
  getFirstSecondOfMonth,
  getFirstSecondOfYear,
  getPeriodDatesByName,
} from '../tools/date.tools';
import {
  AccountBalancePeriod,
  AssetAtDateRapport,
  IncomesExpenceRapport,
  OverTimeAssetRapportResult,
  PeriodDates,
} from '../model/rapport-store.model';
import { format } from 'date-fns';
import da from 'date-fns/esm/locale/da/index.js';

@Injectable({
  providedIn: 'root',
})
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

  loadOverTimeAssetRapport(
    period: string
  ): Promise<OverTimeAssetRapportResult> {
    return new Promise<OverTimeAssetRapportResult>(async (resolve, reject) => {
      const dates: Date[] = this.getDatesAccByPeriod(period);

      console.log(dates);

      try {
        const results: AssetAtDateRapport[] = await Promise.all(
          dates.map((date) =>
            this.operationService.getAssetsRapportStateOnDate(date)
          )
        );
        resolve({ result: results });
      } catch (error) {
        reject('error durant lappel aus service');
        console.error(error);
      }
    });
  }

  async loadIncomesExpencesRapport(
    periods: String[]
  ): Promise<IncomesExpenceRapport> {
    return new Promise<IncomesExpenceRapport>(async (resolve, reject) => {
      const dates: PeriodDates[] = periods.map((m) => getPeriodDatesByName(m));

      try {
        resolve({
          result: await Promise.all(
            dates.map((period) => this.loadIncomesExpencesPeriod(period))
          ),
        });
      } catch (error) {
        reject('error durant lappel aus service');
        console.error(error);
      }
    });
  }

  async loadIncomesExpencesPeriod(
    periodDates: PeriodDates
  ): Promise<AssetAtDateRapport> {
    return new Promise<AssetAtDateRapport>(async (resolve, reject) => {
      try {
        // incomes
        const incomes =
          await this.operationService.getGlobalBalanceAccountBetweenDate(
            periodDates.end,
            periodDates.start,
            'income'
          );

        const expences =
          await this.operationService.getGlobalBalanceAccountBetweenDate(
            periodDates.end,
            periodDates.start,
            'depense'
          );
        resolve({
          assets: incomes,
          liabilities: -expences,
          date: periodDates.end,
        });
      } catch (error) {
        console.log(error);
        reject('erreur dans lappel aux service');
      }
    });
  }

  async loadIncomesRapport(
    periodsSelected: string[]
  ): Promise<AccountBalancePeriod[]> {
    return new Promise<AccountBalancePeriod[]>(async (resolve, reject) => {
      try {
        const dates: PeriodDates[] = periodsSelected.map((m) =>
          getPeriodDatesByName(m)
        );

        const results = await Promise.all(
          dates.map((date) =>
            this.operationService.getBalanceOnLeafByTypeAccountAndDates(
              date.end,
              date.start,
              'income'
            )
          )
        );

        resolve(results);
      } catch (error) {
        reject('erreur ligne BordService:::223');
        console.error(error);
      }
    });
  }

  loadExpencesRapport(
    periodsSelected: string[]
  ): Promise<AccountBalancePeriod[]> {
    return new Promise<AccountBalancePeriod[]>(async (resolve, reject) => {
      try {
        const dates: PeriodDates[] = periodsSelected.map((m) =>
          getPeriodDatesByName(m)
        );

        const results = await Promise.all(
          dates.map((date) =>
            this.operationService.getBalanceOnLeafByTypeAccountAndDates(
              date.end,
              date.start,
              'depense'
            )
          )
        );
          
        resolve(results);
      } catch (error) {
        reject('erreur ligne BordService:::223');
        console.error(error);
      }
    });
  }

  private getDatesAccByPeriod(period: string): Date[] {
    switch (period) {
      case 'week': {
        return getDatesOfDayInYear('Sunday', 2023);
      }

      default: {
        return getAllendMontDatesInYear(2023);
      }
    }
  }
}
