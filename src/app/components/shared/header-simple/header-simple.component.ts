import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'header-simple',
  templateUrl: './header-simple.component.html',
  styleUrls: ['./header-simple.component.css'],
})
export class HeaderSimpleComponent {
  @Input() title: string;

  constructor(private location: Location) {}
  back(): void {
    this.location.back();
  }
}
