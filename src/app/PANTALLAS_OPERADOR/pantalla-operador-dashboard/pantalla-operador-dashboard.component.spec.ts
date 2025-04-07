import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaOperadorDashboardComponent } from './pantalla-operador-dashboard.component';

describe('PantallaOperadorDashboardComponent', () => {
  let component: PantallaOperadorDashboardComponent;
  let fixture: ComponentFixture<PantallaOperadorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaOperadorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaOperadorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
