import { Component, OnInit } from '@angular/core';
import { SupportPageStore } from '../support-page.store';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  constructor(readonly signUpPageStore: SupportPageStore) {}

  ngOnInit() {}
}
