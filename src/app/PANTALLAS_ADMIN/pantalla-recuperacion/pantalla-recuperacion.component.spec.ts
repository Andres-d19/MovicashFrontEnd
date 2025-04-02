import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaRecuperacionComponent } from './pantalla-recuperacion.component';

describe('PantallaRecuperacionComponent', () => {
  let component: PantallaRecuperacionComponent;
  let fixture: ComponentFixture<PantallaRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaRecuperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
