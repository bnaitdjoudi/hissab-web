import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {
  constructor() {}

  ngOnInit() {}
  onTicketTape() {
    console.log('open ticket');
  }

  onPatchTape() {
    console.log('open patch');
  }
}
