import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'header-simple',
  templateUrl: './header-simple.component.html',
  styleUrls: ['./header-simple.component.css'],
})
export class HeaderSimpleComponent {
  @Input() title: string;
  @Output() onReturnClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}
  back(): void {
    this.onReturnClick.emit();
  }
}
