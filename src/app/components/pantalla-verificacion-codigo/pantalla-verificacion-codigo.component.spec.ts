import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaVerificacionCodigoComponent } from './pantalla-verificacion-codigo.component';

describe('PantallaVerificacionCodigoComponent', () => {
  let component: PantallaVerificacionCodigoComponent;
  let fixture: ComponentFixture<PantallaVerificacionCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaVerificacionCodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaVerificacionCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
