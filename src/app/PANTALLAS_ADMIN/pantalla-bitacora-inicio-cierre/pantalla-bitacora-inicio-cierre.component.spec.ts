import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBitacoraInicioCierreComponent } from './pantalla-bitacora-inicio-cierre.component';

describe('PantallaBitacoraInicioCierreComponent', () => {
  let component: PantallaBitacoraInicioCierreComponent;
  let fixture: ComponentFixture<PantallaBitacoraInicioCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaBitacoraInicioCierreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaBitacoraInicioCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
