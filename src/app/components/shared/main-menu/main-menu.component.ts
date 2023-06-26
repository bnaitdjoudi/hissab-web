import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  @Input() selectedRoute: 'dash' | 'operation' | 'account';
  @Output() onMenuSelected: EventEmitter<void> = new EventEmitter<void>();

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    console.log(this.selectedRoute);
  }

  getSelectedClass(menuRoute: any) {
    return this.selectedRoute === menuRoute ? 'selected' : '';
  }

  goto(url: string) {
    this.onMenuSelected.emit();
    this.router.navigate([url]);
  }
}
