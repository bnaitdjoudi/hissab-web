import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Operation } from '../../../model/operation.model';
import { deleteConfirmation } from '../../../tools/alert.contollers';
import { OperationPageStore } from '../operation-page.store';
import { Location } from '@angular/common';
import { LeafAccount } from 'src/app/model/leaf-account.model';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';

@Component({
  selector: 'app-operation-page',
  templateUrl: './operation-page-edit.component.html',
  styleUrls: ['./operation-page-edit.component.scss'],
})
export class OperationPageEditComponent implements OnInit, OnDestroy {
  operation: Operation | undefined;
  leafAccounts: LeafAccount[] = [];

  loadingDelete: HTMLIonLoadingElement;

  suscribtionLeafs: Subscription;
  suscribtionOperation: Subscription;

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  constructor(
    readonly operationStore: OperationPageStore,
    readonly alertController: AlertController,
    readonly _location: Location,
    readonly loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.suscribtionLeafs?.unsubscribe();
    this.suscribtionOperation?.unsubscribe();
  }

  ngOnInit() {
    this.suscribtionOperation = this.operationStore.operation$.subscribe(
      (op) => {
        this.operation = op;
      }
    );
    this.suscribtionLeafs =
      this.operationStore.accountStore.leafAccounts$.subscribe((leafs) => {
        this.leafAccounts = leafs;
      });
  }

  private async showLoading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({
      message: 'updating operation',
    });
  }

  async onSubmitFired() {
    console.log('alert');

    const alert = await this.alertController.create(
      deleteConfirmation(
        'Voulez vous sauvegarder les changement?',
        undefined,
        undefined,
        'custom-alert'
      )
    );

    await alert.present();

    const { role } = await alert.onDidDismiss();
    switch (role) {
      case 'cancel': {
        console.log('cancel alert');
        break;
      }
      case 'confirm': {
        await this.submitOperationUpdate();
        break;
      }
    }
  }

  private async submitOperationUpdate() {
    this.loadingDelete = await this.showLoading();
    this.loadingDelete.present();
    if (this.operationFormComponent.isValidData()) {
      console.log(
        'description:::::' +
          this.operationFormComponent.currentOperation.description
      );
      this.operationStore
        .updateOperation(this.operationFormComponent.currentOperation)
        .then(() => {
          this.loadingDelete.dismiss();
          this._location.back();
        });
    } else {
      this.loadingDelete.dismiss();
    }
  }
}
