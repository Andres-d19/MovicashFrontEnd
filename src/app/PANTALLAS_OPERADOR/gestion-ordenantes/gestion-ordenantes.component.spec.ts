import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOrdenantesComponent } from './gestion-ordenantes.component';

describe('GestionOrdenantesComponent', () => {
  let component: GestionOrdenantesComponent;
  let fixture: ComponentFixture<GestionOrdenantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionOrdenantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionOrdenantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
