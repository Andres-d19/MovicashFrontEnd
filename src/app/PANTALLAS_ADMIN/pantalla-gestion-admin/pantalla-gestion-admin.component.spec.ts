import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaGestionAdminComponent } from './pantalla-gestion-admin.component';

describe('PantallaGestionAdminComponent', () => {
  let component: PantallaGestionAdminComponent;
  let fixture: ComponentFixture<PantallaGestionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallaGestionAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaGestionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
