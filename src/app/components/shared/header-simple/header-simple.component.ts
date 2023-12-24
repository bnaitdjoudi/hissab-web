import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'header-simple',
  templateUrl: './header-simple.component.html',
  styleUrls: ['./header-simple.component.scss'],
})
export class HeaderSimpleComponent {
  @Input() title: string;
  @Input() periodLabel: string;
  @Output() onReturnClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() onPeriodClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}
  back(): void {
    this.onReturnClick.emit();
  }

  period(): void {
    this.onPeriodClick.emit();
  }
}
