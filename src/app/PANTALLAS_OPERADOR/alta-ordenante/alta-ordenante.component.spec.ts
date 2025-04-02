import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaOrdenanteComponent } from './alta-ordenante.component';

describe('AltaOrdenanteComponent', () => {
  let component: AltaOrdenanteComponent;
  let fixture: ComponentFixture<AltaOrdenanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltaOrdenanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaOrdenanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
