import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaAprobacionRechazoComponent } from './pantalla-aprobacion-rechazo.component';

describe('PantallaAprobacionRechazoComponent', () => {
  let component: PantallaAprobacionRechazoComponent;
  let fixture: ComponentFixture<PantallaAprobacionRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaAprobacionRechazoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaAprobacionRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
