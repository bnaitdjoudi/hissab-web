import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../model/account.model';
import { LeafAccount } from '../model/leaf-account.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { AccountDataBase } from './databases/account.db';
import { AccountResume } from '../model/account.resume.model';
import { printError } from '../tools/errorTools';

@Injectable()
export class AccountsService {
  constructor(private readonly accountDb: AccountDataBase) {}

  async initMainAccount(subject: BehaviorSubject<void>): Promise<void> {
    return this.accountDb.initMainAccount(subject);
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.accountDb.findAll();
  }

  async getMainAccounts(): Promise<Account[]> {
    return this.accountDb.getMainAccounts();
  }

  async getAccountById(id: number): Promise<Account> {
    return this.accountDb.findById(id);
  }

  async updateAccount(account: Account, id: number): Promise<Account> {
    return this.accountDb.update(account, id);
  }
  async getSubAccountsByPagingAndAccountId(
    paging: PagingRequest,
    id: number
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      this.accountDb
        .findByIdAccountAndPaging(paging, id)
        .then((res: PagingData<Account>) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(
            'une erreur sai produit lors de chargement la list des account'
          );
          console.error(err);
        });
    });
  }

  async createAccount(account: Account): Promise<Account> {
    return new Promise<any>((resolve, reject) => {
      this.accountDb
        .create(account)
        .then((res) => resolve(res))
        .catch((err) => {
          console.error(err);
          reject('erreur au moment de persister le Account');
        });
    });
  }

  async updateTotalByAccountPath(
    paths: string[],
    diff: number
  ): Promise<Account> {
    return this.accountDb.ajusteDiffByPath(paths, diff);
  }

  async getAccountByType(type: string): Promise<Account[]> {
    return new Promise<Account[]>((resolve, reject) => {
      this.accountDb
        .getAccountsByType(type)
        .then((accounts) => resolve(accounts))
        .catch((err) => {
          console.error(err);
          reject('erreur lors du de lappelle a la base de données');
        });
    });
  }

  async getLeatAccountExcepttype(types: string[]): Promise<LeafAccount[]> {
    return new Promise<LeafAccount[]>((resolve, reject) => {
      this.accountDb
        .findAllLeafExeptType(types)
        .then((leafs) => {
          resolve(leafs);
        })
        .catch((err) => {
          reject("probleme lors de l'appelle du service !!!!");
          console.error(err);
        });
    });
  }

  async getLeatAccountExceptOneByIds(ids: number[]): Promise<LeafAccount[]> {
    return new Promise<LeafAccount[]>((resolve, reject) => {
      this.accountDb
        .findAllLeafExeptOneByIds(ids)
        .then((leafs) => {
          resolve(leafs);
        })
        .catch((err) => {
          reject("probleme lors de l'appelle du service !!!!");
          console.error(err);
        });
    });
  }

  findAccountByPath(transfer: string): Promise<Account> {
    return new Promise<Account>((resolve, reject) => {
      this.accountDb
        .finByPath(transfer)
        .then((acc) => {
          resolve(acc);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  findAccountStateByIdAndDates(
    id: number,
    startDate: Date,
    endDate: Date
  ): Promise<Account> {
    return new Promise<Account>((resolve, reject) => {
      this.accountDb
        .findAccountStateByIdAndDates(id, startDate, endDate)
        .then((acc: Account) => resolve(acc))
        .catch((err: any) =>
          printError('erreur duran tla recuperation du resumé', reject, err)
        );
    });
  }

  async getResumeOfAccountById(id: number): Promise<AccountResume> {
    return new Promise<AccountResume>((resolve, reject) => {
      this.accountDb
        .getResumeOfAccountById(id)
        .then((res) => resolve(res))
        .catch((err) =>
          printError('erreur duran tla recuperation du resumé', reject, err)
        );
    });
  }

  async finAccountOnSearching(
    text: string,
    withoutOp: boolean
  ): Promise<Account[]> {
    return new Promise<Account[]>((resolve, reject) => {
      this.accountDb
        .findAccountByTextSerach(text, withoutOp)
        .then((accounts: Account[]) => {
          resolve(accounts);
        });
    });
  }
  async getSubAccountsStateByPagingAndAccountId(
    val: PagingRequest,
    id: number,
    startDate: Date,
    endDate: Date
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      this.accountDb
        .getSubAccountsStateByPagingAndAccountId(val, id, startDate, endDate)
        .then((data) => resolve(data))
        .catch((e) =>
          printError(
            "erreur pour l'appelle de la base de données pour sub account",
            e,
            reject
          )
        );
    });
  }

  finAccountOnSearchingText(
    val: string | undefined,
    paging: PagingRequest
  ): Promise<PagingData<Account>> {
    return new Promise<PagingData<Account>>((resolve, reject) => {
      if (val || val === '') {
        this.accountDb
          .finAccountOnSearchingText(val, paging)
          .then((data: PagingData<Account>) => resolve(data))
          .catch((error: any) => {
            console.error(error);
            reject('error on searching on DB');
          });
      } else {
        resolve({ currentPage: 0, data: [], totalPage: 0 });
      }
    });
  }
}
