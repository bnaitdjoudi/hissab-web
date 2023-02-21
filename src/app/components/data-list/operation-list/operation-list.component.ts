import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { LeafAccount } from 'src/app/main/model/leaf-account.model';
import { Operation } from 'src/app/main/model/operation.model';

@Component({
  selector: 'operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss'],
})
export class OperationListComponent implements OnInit {
  @Input() operations: Operation[] = [];
  @Input() isMoreData: boolean = true;
  @Input() currBalFun: (debit: number, credit: number) => any[];

  @Output() onElementSelected = new EventEmitter<Operation>();
  @Output() onIonInfiniteScroll = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() onDelete = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

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
}
