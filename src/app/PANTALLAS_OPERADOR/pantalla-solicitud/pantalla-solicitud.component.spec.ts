import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaSolicitudComponent } from './pantalla-solicitud.component';

describe('PantallaSolicitudComponent', () => {
  let component: PantallaSolicitudComponent;
  let fixture: ComponentFixture<PantallaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaSolicitudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
