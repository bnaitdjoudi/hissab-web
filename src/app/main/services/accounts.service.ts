import { Injectable, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { LeafAccount } from '../model/leaf-account.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { AccountDataBase } from './databases/account.db';

@Injectable()
export class AccountsService {
  constructor(private readonly accountDb: AccountDataBase) {}

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

  async createAccount(account: Account): Promise<any> {
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
}
