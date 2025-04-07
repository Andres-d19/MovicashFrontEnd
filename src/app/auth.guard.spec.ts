import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Asegúrate de que el módulo de pruebas esté configurado
    });
    guard = TestBed.inject(AuthGuard); // Obtiene la instancia de AuthGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Verifica que la guardia esté correctamente instanciada
  });
});
