import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  @Input() selectedRoute: 'dash' | 'operation' | 'account';

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    console.log(this.selectedRoute);
  }

  getSelectedClass(menuRoute: any) {
    return this.selectedRoute === menuRoute ? 'selected' : '';
  }

  goto(url: string) {
    this.router.navigate([url]);
  }
}
