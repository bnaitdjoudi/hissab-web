import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { isObservable, Observable, Subscription } from 'rxjs';
import { Operation } from '../../../model/operation.model';
import { deleteConfirmation } from '../../../tools/alert.contollers';
import { OperationPageStore } from '../operation-page.store';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account.model';

@Component({
  selector: 'app-operation-page',
  templateUrl: './operation-page-view.component.html',
  styleUrls: ['./operation-page-view.component.scss'],
})
export class OperationPageViewComponent implements OnInit, OnDestroy {
  operation: Operation;
  account: Account = { type: 'actif' } as unknown as Account;
  suscribtionOperation: Subscription;

  loadingDelete: HTMLIonLoadingElement;
  constructor(
    readonly operationStore: OperationPageStore,
    private alertController: AlertController,
    private _location: Location,
    private loadingCtrl: LoadingController,
    readonly router: Router
  ) {}
  ngOnDestroy(): void {
    this.suscribtionOperation?.unsubscribe();
  }

  ngOnInit() {
    this.suscribtionOperation = this.operationStore.operation$.subscribe(
      (op) => {
        if (op && op.id) this.operation = op;
      }
    );

    this.operationStore.account$.subscribe((acc) => {
      if (acc) this.account = acc;
    });
  }

  async onDeleteFired() {
    console.log('alert');
    const alert = await this.alertController.create(
      deleteConfirmation(
        'Alert Operation suppression!',
        undefined,
        undefined,
        'custom-alert'
      )
    );

    await alert.present();

    const { role } = await alert.onDidDismiss();
    switch (role) {
      case 'cancel': {
        console.info('cancel');
        break;
      }

      case 'confirm': {
        this.processOperationDelete();
      }
    }
  }

  private async processOperationDelete() {
    this.loadingDelete = await this.showLoading();
    this.loadingDelete.present();

    this.operationStore
      .deleteCurrentOperatoion()
      .then(() => {
        this.loadingDelete.dismiss();
        this._location.back();
      })
      .catch((err) => {
        console.error(err);
        this.loadingDelete.dismiss();
      });
  }

  async showLoading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({
      message: 'deleting operation',
    });
  }

  goToEditPage() {
    if (
      this.operationStore.state &&
      this.operationStore.state.currentOperation
    ) {
      this.router.navigate(['/operation/' + this.operation.id + '/edit'], {});
    } else {
      console.log('dddd');
    }
  }

  goToHome() {
    this.router.navigate(['/dashboard'], {});
  }

  goToAccountParent() {
    if (this.account) this.router.navigate(['/account/' + this.account.id], {});
  }
}
