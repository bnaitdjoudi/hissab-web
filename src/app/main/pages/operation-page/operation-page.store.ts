import { Injectable } from '@angular/core';
import { Operation } from '../../model/operation.model';
import { OperationService } from '../../services/operation.service';
import { RouteParamsStore } from '../../store/route.params.store';
import { Store } from '../../store/store';
import { AccountPageStore } from '../account-page/account-page.store';

@Injectable()
export class OperationPageStore extends Store<Operation | null> {
  constructor(
    private readonly operationService: OperationService,
    private readonly routeParamsStore: RouteParamsStore,
    readonly accountStore: AccountPageStore
  ) {
    super(null);

    this.routeParamsStore.idOperation$.subscribe((id) => {
      if (id > 0) {
        this.operationService
          .getOperationJoinAccountById(id)
          .then((operation) => {
            this.setState(operation);
            this.routeParamsStore.setIdCount(operation.idAccount);
          })
          .catch((e) => console.error(e));
      }
    });
  }
  async deleteCurrentOperatoion(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.state) {
        this.deleteOperationById(this.state?.id)
          .then(() => {
            resolve();
          })
          .catch((err) => reject(err));
      } else {
        reject('no operation selected!!!!');
      }
    });
  }

  async deleteOperationById(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.operationService
        .deleteOperationDate(id)
        .then(() => resolve())
        .catch((err) => {
          reject('erreur lors de la suppression');
          console.error(err);
        });
    });
  }

  async updateOperation(operation: Operation): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.operationService
        .businessUpdateOperationDate(operation)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject('erreur durant excecusion du service');
          console.error(err);
        });
    });
  }
}
