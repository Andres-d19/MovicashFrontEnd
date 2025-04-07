import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBuenIntentoComponent } from './pantalla-buen-intento.component';

describe('PantallaBuenIntentoComponent', () => {
  let component: PantallaBuenIntentoComponent;
  let fixture: ComponentFixture<PantallaBuenIntentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaBuenIntentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaBuenIntentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
