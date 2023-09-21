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
import { number } from 'echarts';
import { pathToAllParentUniquePath } from 'src/app/tools/tools';

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
    readonly accountService: AccountsService
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
      const patch: Patch = JSON.parse(
        atob(atob(data.replace('data:text/plain;base64,', '')))
      );
      const results = patch.queries.map(async (query) => {
        console.log('QUERY:' + query.query);
        return {
          code: query.codePatch,
          statut: await this.dataBaseService.runPatchQuery(query),
        };
      });

      alert(JSON.stringify(results));
    }
  }

  async processToMaintaine(): Promise<void> {
    try {
      await this.accountService.resetAllAccountTo(0);
      const leafAccounts =
        await this.accountService.getLeatAccountExceptOneByIds([0]);

      leafAccounts.forEach(async (leaf) => {
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
        }

        await this.accountService.updateTotalByAccountPath(
          [...pathToAllParentUniquePath(leaf.path)],
          balance
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
}
