import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaGestionOperadorComponent } from './pantalla-gestion-operador.component';

describe('PantallaGestionOperadorComponent', () => {
  let component: PantallaGestionOperadorComponent;
  let fixture: ComponentFixture<PantallaGestionOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaGestionOperadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaGestionOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
