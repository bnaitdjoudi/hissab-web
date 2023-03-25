import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardMainAccountComponent } from './card-main-accounts.component';

describe('CardMainAccountComponent', () => {
  let component: CardMainAccountComponent;
  let fixture: ComponentFixture<CardMainAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CardMainAccountComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMainAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onAjuste should run ajusteAccount.emit', () => {
    spyOn(component.ajusteAccount, 'emit');

    component.onAjuste({} as Event);
    expect(component.ajusteAccount.emit).toHaveBeenCalled();
  });
});
