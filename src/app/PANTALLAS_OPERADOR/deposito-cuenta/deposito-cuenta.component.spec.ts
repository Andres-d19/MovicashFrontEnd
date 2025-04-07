import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoCuentaComponent } from './deposito-cuenta.component';

describe('DepositoCuentaComponent', () => {
  let component: DepositoCuentaComponent;
  let fixture: ComponentFixture<DepositoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositoCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
