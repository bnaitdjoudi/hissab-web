import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


@Component({
  selector: 'card-main-account',
  templateUrl: './card-main-accounts.component.html',
  styleUrls: ['./card-main-accounts.component.scss'],
})
export class CardMainAccountComponent implements OnInit, OnDestroy {


  @Input() total:number | null = 0;
  @Input() title:string = '';

  @Output() ajusteAccount = new EventEmitter<void>();
 




  constructor() { 
    
  }

  ngOnDestroy(): void {
    
    console.log('CardMainAccountComponent::ngOnDestroy');
   
  }
  ngOnInit(): void {
    console.log('CardMainAccountComponent::ngOnInit');
    
   
  }

  onAjuste(event:Event):void {
    console.log('fjl;sdjf;l');
    this.ajusteAccount.emit();
  }
}
