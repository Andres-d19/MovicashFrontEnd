
import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs';

  @Injectable({
  providedIn: 'root'
})
export class GestionOrdenanteService {
  private apiUrl = `${environment.baseUrl}/ordenante`;

  constructor(private http: HttpClient) { }

  crearOrdenante(ordenante: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token no encontrado');
      return throwError(() => new Error('Token no encontrado'));
    }
    

    // Configurar las cabeceras con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/createOrdenante`, ordenante, { headers })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error al registrar el ordenante';
        let duplicateField = null;

       // Manejo específico para errores de duplicados
          if (error.status === 500 && error.error?.details?.includes('duplicate key error')) {
            if (error.error.details.includes('RFCOrdenante_1')) {
              errorMessage = 'El RFC ya existe en la base de datos';
              duplicateField = 'RFCOrdenante';
            } else if (error.error.details.includes('NumeroCuenta_1')) {
              errorMessage = 'El número de cuenta ya existe en la base de datos';
              duplicateField = 'NumeroCuenta';
            }
          }
 
          else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => ({ 
            message: errorMessage,
            duplicateField: duplicateField
          }));
        })
      );
  }
}