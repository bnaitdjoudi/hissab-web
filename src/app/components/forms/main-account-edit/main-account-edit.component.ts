import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'main-account-edit',
  templateUrl: './main-account-edit.component.html',
  styleUrls: ['./main-account-edit.component.scss'],
})
export class MainAccountEditComponent implements OnInit {
  @Input() trigger: string;
  @Input() isOpen = false;
  @Output() onConfirm = new EventEmitter<number>();

  @ViewChild(IonModal) modal: IonModal;

  constructor() {}

  ngOnInit() {}

  montant = 0;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.montant, 'confirm');
  }

  onWillDismissEvent(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.onConfirm.emit(this.montant);
    }
  }
}
