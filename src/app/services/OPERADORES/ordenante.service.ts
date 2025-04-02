import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs'; // Asegúrate de importar catchError aquí

@Injectable({
  providedIn: 'root'
})
export class OrdenanteService {

  // URL base de la API
  private apiUrl = 'http://localhost:8090/ordenante';  // Cambia esto si es necesario

  constructor(private http: HttpClient) { }

  obtenerOrdenantes(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/getAllOrdenantes`).pipe(
      // Accede al campo 'data' dentro de la respuesta
      map((response: { ordenantes: any; }) => response.ordenantes),
      catchError(this.handleError) // Manejo de errores
    );
  }

  obtenerOrdenantePorRFC(rfc: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getOrdenantePorRFC/${rfc}`).pipe(
      catchError(this.handleError)
    );
  }

  crearOrdenante(ordenante: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createOrdenante`, ordenante).pipe(
      catchError(this.handleError)
    );
  }

  actualizarOrdenante(rfc: string, ordenante: any): Observable<any> {
    // Aquí se pasa RFCOrdenante correctamente en la URL
    return this.http.put<any>(`${this.apiUrl}/updateOrdenante/${rfc}`, ordenante).pipe(
      catchError(this.handleError)
    );
  }

  eliminarOrdenante(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteOrdenante/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Si es un error del servidor (statusCode no válido o falta)
    if (error.status === 0) {
      console.error('Error de conexión al servidor:', error);
      return throwError('Error de conexión al servidor. Intenta nuevamente más tarde.');
    }

    // Si el error tiene un código de estado no válido
    if (!error.status) {
      return throwError('Error desconocido. El código de estado es inválido.');
    }

    // Si es un error general de HTTP
    return throwError(`Error ${error.status}: ${error.message}`);
  }
}
