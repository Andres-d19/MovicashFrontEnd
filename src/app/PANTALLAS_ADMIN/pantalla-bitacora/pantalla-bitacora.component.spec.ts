import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBitacoraComponent } from './pantalla-bitacora.component';

describe('PantallaBitacoraComponent', () => {
  let component: PantallaBitacoraComponent;
  let fixture: ComponentFixture<PantallaBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaBitacoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
