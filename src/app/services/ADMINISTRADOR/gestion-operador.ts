import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private apiUrlOperator = 'http://localhost:8090/operator';   
  private apiUrl = 'http://localhost:8090/auth'
  constructor(private http: HttpClient) { }


  // Método para manejar errores en las solicitudes
    private handleError(error: any) {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        // Error en el lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Código de error: ${error.status}, ` + `Mensaje: ${error.message}`;
      }
      return throwError(errorMessage);
    }

  registrar(operador: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, operador)
      .pipe(
        catchError(this.handleError)
      );
  }



  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Asegurarse de que esto solo se ejecute en el navegador
      return localStorage.getItem('token');
    }
    return null;  
  }

  // Método para generar encabezados con el JWT
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '', 
      'Content-Type': 'application/json'
    });
  }

  

  // Método para obtener todos los operadores
  getOperadores(): Observable<any> {
    return this.http.get(this.apiUrlOperator, { headers: this.getHeaders() });
  }

  // Método para buscar un operador por RFC
  buscarOperadorPorRFC(RFC: string): Observable<any> {
    return this.http.get(`${this.apiUrlOperator}/${RFC}`, { headers: this.getHeaders() });
  }

  // Método para actualizar un operador
  editarOperador(rfc: string, operadorData: any): Observable<any> {
    return this.http.put(`${this.apiUrlOperator}/${rfc}`, operadorData, { headers: this.getHeaders() });
  }

  // Método para eliminar un operador
  eliminarOperador(RFC: string): Observable<any> {
    return this.http.delete(`${this.apiUrlOperator}/${RFC}`, { headers: this.getHeaders() });
  }
}
