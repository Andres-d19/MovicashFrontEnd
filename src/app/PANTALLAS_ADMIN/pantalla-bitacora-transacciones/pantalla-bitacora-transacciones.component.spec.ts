import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBitacoraTransaccionesComponent } from './pantalla-bitacora-transacciones.component';

describe('PantallaBitacoraTransaccionesComponent', () => {
  let component: PantallaBitacoraTransaccionesComponent;
  let fixture: ComponentFixture<PantallaBitacoraTransaccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaBitacoraTransaccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaBitacoraTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
