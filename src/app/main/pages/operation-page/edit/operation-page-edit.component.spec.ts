import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperationPageEditComponent } from './operation-page-edit.component';

describe('OperationPageComponent', () => {
  let component: OperationPageEditComponent;
  let fixture: ComponentFixture<OperationPageEditComponent>;
  
  

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OperationPageEditComponent],
      imports: [IonicModule.forRoot()],
      providers:[]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationPageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
