import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AdvertenciaService } from './services/advertencia.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private AdvertenciaService:AdvertenciaService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    console.log('AuthGuard: Evaluando acceso a la ruta:', state.url);

    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      // Decodificar el token para obtener el rol del usuario
      const decodedToken: any = jwtDecode(token);
      const userRole = decodedToken.role;
      console.log('AuthGuard: Token decodificado, rol del usuario:', userRole);

      // Verificar si la ruta requiere uno o más roles específicos
      const requiredRoles = route.data['role'];
      console.log('AuthGuard: Roles requeridos para la ruta:', requiredRoles);

      // Verificar si el rol del usuario está en el array de roles permitidos
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        console.warn(`AuthGuard: Acceso denegado. Rol actual (${userRole}) no coincide con los roles requeridos (${requiredRoles}).`);
        this.AdvertenciaService.mostrarError('ACESO DENEGADO', 'Tu cuenta no tiene Permiso para acceder a esta pagina');
        this.router.navigate(['/pantalla-buen-intento']);
        return false;
      }

      console.log('AuthGuard: Acceso permitido.');
      return true; 

    } catch (error) {
      console.error('AuthGuard: Error al decodificar el token:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}
