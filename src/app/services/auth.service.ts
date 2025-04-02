import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/auth';  // Aquí cambiamos /api/login por /auth
  private tokenKey = 'authToken';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión y enviar el código de verificación
  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { CorreoElectronico: correo, Password: password })
    
      .pipe(
        catchError(this.handleError)
      );
  }
  //obtiene el nombre del token solo es temporal y no afecata en nada, solo esta obteniedno el tokes y mandadado el nombre a otro componente
  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const cuerpoDeToken = this.decodeToken(token);
      console.log('Payload completo:', cuerpoDeToken);
      return cuerpoDeToken?.NombrePersonal  || null;
    }
    return null;
  }
 
  
  // Método para verificar el código de verificación y obtener el token
  verificarCodigo(correo: string, codigo: string){
    const payload = {
      CorreoElectronico: correo,
      code: codigo
    };
  
    return this.http.post<any>(`${this.apiUrl}/verificar-codigo`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // Método para recuperar contraseña
  recoverPassword(correo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recover-password`, { CorreoElectronico: correo })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para actualizar contraseña
  updatePassword(correo: string, tempPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-password`, { CorreoElectronico: correo, tempPassword, newPassword })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para almacenar el token en el almacenamiento local
  setToken(token: string) {
    if (typeof window !== 'undefined') {  // Verifica si estamos en el navegador
      localStorage.setItem(this.tokenKey, token);
      this.tokenSubject.next(token);
    }
  }

  // Método para eliminar el token (cerrar sesión)
  logout() {
    if (typeof window !== 'undefined') {  // Verifica si estamos en el navegador
      localStorage.removeItem(this.tokenKey);
      this.tokenSubject.next(null);
    }
  }

  // Método para manejar errores en las solicitudes
  private handleError(error: any) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error en el lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error en el backend
      errorMessage = `Código de error: ${error.status}, ` + `Mensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Método para obtener el JWT desde el almacenamiento
  getToken(): string | null {
    if (typeof window !== 'undefined') {  // Verifica si estamos en el navegador
      return localStorage.getItem(this.tokenKey); // Devuelve el token si existe
    }
    return null;  // Si no estamos en el navegador, retorna null
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token); // Verifica si el token existe y no ha expirado
  }

  // Método para verificar si el token ha expirado
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    const expirationDate = payload?.exp ? new Date(payload.exp * 1000) : null;
    return expirationDate ? expirationDate < new Date() : false;
  }

  // Método para decodificar el token y obtener su payload
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  // Método para obtener el rol del usuario desde el token JWT
  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      return payload?.role || null;
    }
    return null;
  } 


  addAdmin(adminData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/registrar`, adminData) // Asegúrate de tener este endpoint en tu backend
          .pipe(
            catchError(this.handleError));}

}
