import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { isObservable, Observable } from 'rxjs';
import { Operation } from '../../../model/operation.model';
import { deleteConfirmation } from '../../../tools/alert.contollers';
import { OperationPageStore } from '../operation-page.store';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-operation-page',
  templateUrl: './operation-page-view.component.html',
  styleUrls: ['./operation-page-view.component.scss'],
})
export class OperationPageViewComponent implements OnInit {
  operation: Operation;

  loadingDelete: HTMLIonLoadingElement;
  constructor(
    readonly operationStore: OperationPageStore,
    private alertController: AlertController,
    private _location: Location,
    private loadingCtrl: LoadingController,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.operationStore.observable.subscribe((op) => {
      console.log(JSON.stringify(op));
      if (op) this.operation = op;
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
    if (this.operationStore.state) {
      this.router.navigate(
        ['/operation/' + this.operationStore.state.id + '/edit'],
        {}
      );
    } else {
      console.log('dddd');
    }
  }
}
