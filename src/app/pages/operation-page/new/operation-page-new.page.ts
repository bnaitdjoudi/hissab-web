import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { Operation } from 'src/app/model/operation.model';
import { avoidOperationNumberConfusion } from 'src/app/tools/tools';
import { OperationPageStore } from '../operation-page.store';
import { Account } from 'src/app/model/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operation-page-new',
  templateUrl: './operation-page-new.page.html',
  styleUrls: ['./operation-page-new.page.scss'],
})
export class OperationPageNewPage implements OnInit, OnDestroy {
  currentOperation: Operation;
  subscription: Subscription;
  subscriptionLeaf: Subscription;
  subscriptionAccount: Subscription;
  leafs: LeafAccount[] = [];
  accountType: string = 'actifs';
  currentAccount: Account;

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  constructor(
    readonly operationStore: OperationPageStore,
    readonly router: Router
  ) {}
  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionLeaf?.unsubscribe();
    this.subscriptionAccount?.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.operationStore.operation$.subscribe((op) => {
      if (op) {
        this.currentOperation = op;
      }
    });

    this.subscriptionAccount =
      this.operationStore.accountStore.currentAccount$.subscribe((acc) => {
        if (acc) {
          this.accountType = acc.type;
        }
        console.log('accccccc::::' + acc.acountName);
        this.currentAccount = acc;
      });
  }

  async submit() {
    if (this.operationFormComponent.isValidData()) {
      try {
        let id = await this.operationStore.createNewOperation(
          avoidOperationNumberConfusion(
            this.operationFormComponent.currentOperation
          )
        );

        this.router.navigate(['operation/' + id]);
      } catch (error) {
        console.error(error);
      }
    }
  }

  onLoadLeafAccount(exeptId: number | undefined) {
    this.operationStore.onLoadLeafAccount(exeptId);
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }
}
