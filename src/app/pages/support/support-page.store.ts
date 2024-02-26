import { Injectable } from '@angular/core';
import { MainStore } from 'src/app/store/main.store';
import { Store } from 'src/app/store/store';
import { SupportModel } from 'src/app/model/support.model';
import { Observable } from 'rxjs';
import { ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { DataBaseService } from 'src/app/services/databases/database.service';

import { Patch } from 'src/app/model/patch.model';
import { OperationService } from 'src/app/services/operation.service';
import { AccountsService } from 'src/app/services/accounts.service';

import { pathToAllParentUniquePath } from 'src/app/tools/tools';
import { BackupService } from 'src/app/services/backup.service';
import { Account } from 'src/app/model/account.model';
import { AccountDto } from 'src/app/model/dtos/account.dto';
import { Operation } from 'src/app/model/operation.model';
import { OperationDto } from 'src/app/model/dtos/operation.dto';
import { LeafAccount } from 'src/app/model/leaf-account.model';

@Injectable({
  providedIn: 'root',
})
export class SupportPageStore extends Store<SupportModel> {
  fileObject$: Observable<ChooserResult | undefined> = this.select<
    ChooserResult | undefined
  >((state) => state.fileObject);
  constructor(
    readonly mainStore: MainStore,
    readonly dataBaseService: DataBaseService,
    readonly operationService: OperationService,
    readonly accountService: AccountsService,
    readonly backupService: BackupService
  ) {
    super({ validDate: false });
  }

  setFileObject(fileObject: ChooserResult | undefined) {
    this.setState({ ...this.state, fileObject: fileObject });
  }

  async applyFile() {
    let data: string = this.state.fileObject.dataURI;
    console.log(atob(atob(data.replace('data:text/plain;base64,', ''))));
    if (this.state.fileObject) {
      console.log('Patch: parsing');
      try {
        const patch: Patch = JSON.parse(
          atob(atob(data.replace('data:text/plain;base64,', '')))
        );

        console.log('Patch:', JSON.stringify(patch));

        const results = patch.queries.map(async (query) => {
          console.log('query:' + query.query);
          return {
            code: query.codePatch,
            statut: await this.dataBaseService.runPatchquery(query),
          };
        });

        alert(JSON.stringify(results));
      } catch (error) {
        console.log('errreur:', JSON.stringify(error));
      }
    }
  }

  async processToMaintaine(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.accountService.resetAllAccountTo(0);
        const leafAccounts =
          await this.accountService.getLeatAccountExceptOneByIds([0]);
        await Promise.all(leafAccounts.map((leaf) => this.leafProcess(leaf)));
      } catch (error) {
        console.error(error);
      }
    });
  }

  private async leafProcess(leaf: LeafAccount): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        let balance: number = 0;
        const operations = await this.operationService.getAllYearOperation(
          leaf.id
        );
        if (operations.length > 0) {
          console.log('Account:' + leaf.acountName);
          operations[0].balance = operations[0].debit - operations[0].credit;

          for (let i = 1; i < operations.length && operations.length > 1; i++) {
            operations[i].balance =
              operations[i].debit -
              operations[i].credit +
              operations[i - 1].balance;
          }
          balance = operations[operations.length - 1].balance;
          console.log(
            'account balance: ' + operations[operations.length - 1].balance
          );

          await Promise.all(
            operations.map((op) =>
              this.operationService.updateOperation(op, op.id)
            )
          );
          await this.accountService.updateTotalByAccountPath(
            [...pathToAllParentUniquePath(leaf.path)],
            balance
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  async makeBackup() {
    const accounts: Account[] = await this.accountService.getAllAccounts();

    await Promise.all(
      accounts
        .map((account) => this.getAccountDtos(account))
        .map((account) => this.performAccount(account))
    );

    await this.backupService.orderTreeAccount();
  }

  private async performAccount(account: AccountDto) {
    console.log('creating account : ', account.acountName);
    const acc = await this.backupService.createAccounts(account);
    console.log('created ! ', acc.accountId);

    if (acc.isLeaf) {
      console.log('creating operations account : ', account.acountName);
      const operations = await this.operationService.getOperationsByAccountId(
        acc.profileId
      );

      const operationDtos = operations.map((op) =>
        this.createOperationDtos(op)
      );
      operationDtos.forEach(
        (op) => (op.idAccount = acc.accountId ? acc.accountId : 0)
      );

      await Promise.all(
        operationDtos.map((op) => this.backupService.createOperation(op))
      );
      console.log('operation created ! ', acc.acountName);
    }
  }

  private createOperationDtos(operation: Operation): OperationDto {
    return {
      operationProfile: 'brahim',
      numTrans: operation.numTrans,
      time: operation.time,
      description: operation.description,
      statut: operation.statut,
      credit: operation.credit,
      debit: operation.debit,
      balance: operation.balance,
      idAccount: operation.idAccount,
      transfer: operation.transfer,
      attachement: operation.attachment,
    };
  }

  private getAccountDtos(account: Account): AccountDto {
    return {
      accountProfile: 'brahim',
      profileId: account.id,
      acountName: account.acountName,
      balance: account.rbalance ? account.rbalance : 0,
      isMain: account.isMain,
      type: account.type,

      path: account.path,
      isLeaf: account.isLeaf,
    };
  }
}
