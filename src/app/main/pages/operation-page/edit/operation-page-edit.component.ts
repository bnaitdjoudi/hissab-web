import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { isObservable, Observable, Subscription } from 'rxjs';
import { Operation } from '../../../model/operation.model';
import { deleteConfirmation } from '../../../tools/alert.contollers';
import { OperationPageStore } from '../operation-page.store';
import { Location } from '@angular/common';
import { LeafAccount } from 'src/app/main/model/leaf-account.model';
import { OperationFormComponent } from 'src/app/components/forms/operation-form/operation-form.component';

@Component({
  selector: 'app-operation-page',
  templateUrl: './operation-page-edit.component.html',
  styleUrls: ['./operation-page-edit.component.scss'],
})
export class OperationPageEditComponent implements OnInit, OnDestroy {
  @Input() operation$: Observable<Operation | null>;
  leafAccounts: LeafAccount[] = [];

  loadingDelete: HTMLIonLoadingElement;

  suscribtionLeafs: Subscription;

  @ViewChild(OperationFormComponent)
  operationFormComponent: OperationFormComponent;

  constructor(
    readonly operationStore: OperationPageStore,
    private alertController: AlertController,
    private _location: Location,
    private loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.suscribtionLeafs?.unsubscribe();
  }

  ngOnInit() {
    this.operation$ = this.operationStore.observable;
    this.suscribtionLeafs =
      this.operationStore.accountStore.leafAccounts$.subscribe((leafs) => {
        this.leafAccounts = leafs;
      });
  }

  isOperationObservable(): boolean {
    return this.operation$ ? isObservable(this.operation$) : false;
  }

  async showLoading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({
      message: 'updating operation',
    });
  }

  async onSubmitFired() {
    console.log('alert');
    const alert = await this.alertController.create(
      deleteConfirmation(
        'Voulez vous sauvegarder les changement?',
        () => console.log('cancel'),
        () => this.sumitOperationUpdate(),
        'custom-alert'
      )
    );

    await alert.present();
  }

  private async sumitOperationUpdate() {
    this.loadingDelete = await this.showLoading();
    this.loadingDelete.present();
    if (this.operationFormComponent.isValidData()) {
      this.operationStore
        .updateOperation(this.operationFormComponent.operation)
        .then(() => {
          this.loadingDelete.dismiss();
          this._location.back();
        });
    } else {
      this.loadingDelete.dismiss();
    }
  }
}
