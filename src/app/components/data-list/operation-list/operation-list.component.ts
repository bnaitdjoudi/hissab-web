import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Observable, Subscription, map } from 'rxjs';
import { Account } from 'src/app/model/account.model';

import { Operation } from 'src/app/model/operation.model';

@Component({
  selector: 'operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss', './../data-list-header.scss'],
})
export class OperationListComponent implements OnInit, OnDestroy {
  @Input() operations: Observable<Operation[]>;
  @Input() isMoreData: boolean = true;
  @Input() currBalFun: (debit: number, credit: number) => any[];

  @Output() onElementSelected = new EventEmitter<Operation>();
  @Output() onIonInfiniteScroll = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() onBackToParentFired = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<number>();
  @Input() account: Account;
  @Input() periodLabel: string;

  operationsData: Operation[] = [];
  operationGroup: Map<string, Operation[]> = new Map<string, Operation[]>();
  groupeKeys: string[] = [];
  operationsObservable: Observable<Operation[]>;
  suscribtion: Subscription;

  constructor() {}

  ngOnDestroy(): void {
    console.log('operation list distroy!!');
  }

  ngOnInit() {
    this.suscribtion = this.operations.subscribe((val) => {
      this.operationsData = val.filter(
        (el) => el.idAccount === this.account.id
      );
      this.operationsData.forEach((el) => {
        let currentGroupe: Operation[] | undefined = this.operationGroup.get(
          formatInTimeZone(el.time, 'America/New_York', 'dd MMM yyyy')
        );
        let pureGroupe: Operation[] = currentGroupe ? currentGroupe : [];
        if (!pureGroupe.some((op) => op.id === el.id)) {
          this.operationGroup.set(
            formatInTimeZone(el.time, 'America/New_York', 'dd MMM yyyy'),
            [...pureGroupe, el]
          );
        }
      });

      this.groupeKeys = Array.from(this.operationGroup.keys());
    });
  }

  onIonInfinite(ev: Event) {
    this.onIonInfiniteScroll.emit(ev as InfiniteScrollCustomEvent);
  }

  onSelectOperation(operation: Operation) {
    this.onElementSelected.emit(operation);
  }

  onDeleteFired(id: number | undefined) {
    if (!!id) {
      this.onDelete.emit(id);
    }
  }

  multiply(type: string): number {
    return type === 'actif' || type === 'income' ? 1 : -1;
  }

  backToParent() {
    this.onBackToParentFired.emit();
  }
}
