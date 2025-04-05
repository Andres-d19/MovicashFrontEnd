
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

/**
 * Interfaz que define la estructura de una transacción.
 */
export interface Transaccion {

  IdComprobante: string;                  
  ClaveRastreo: string;                               
  NumeroCuentaOrdenante: string;                      
  NombreCompletoOrdenante: string;                    
  NombreCompletoBeneficiario: string;                 
  NumeroCuentaBeneficiario: string;                   
  RFCOperador: string;                                
  NombreCompletoOperador: string;                     
  Monto: number;                                      
  Tipo: string;                                       
  Estado: string | undefined;                        
  Fecha: string;                                      
  Concepto?: string;                                  
}


@Injectable({
  providedIn: 'root' 
})
export class BitacoraService {
 
  /** Base URL del backend */
  private readonly apiUrlBase = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el token almacenado en el localStorage.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene la lista de transacciones pendientes desde el backend.
   * @returns Observable con la lista de transacciones.
   */
  obtenerTransaccionesPendientes() {
    return this.http.get<{ success: boolean, transacciones: Transaccion[] }>(`${this.apiUrlBase}/transacciones/obtenerTranssacciones`, { headers: this.getAuthHeaders() })
    .pipe(
      map(response => response?.transacciones || response), // Soporta ambas estructuras
      catchError(this.handleError)
    );
  }


 

  /**
   * Obtiene los detalles de una transacción específica.
   * @param idTransaccion ID de la transacción.
   * @returns Observable con los detalles de la transacción.
   */
  obtenerDetallesTransaccion(idTransaccion: string) {
    return this.http.get<Transaccion>(`${this.apiUrlBase}/transaccion/report/${idTransaccion}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

    /**
   * Obtiene las transacciones filtradas por estado.
   * @param estado Estado de la transacción ('Aprobado', 'Pendiente', 'Cancelado').
   * @returns Observable con la lista de transacciones filtradas.
   */
    obtenerTransaccionesPorEstado(estado: string): Observable<Transaccion[]> {
      return this.http.get<{ success: boolean, transacciones: Transaccion[] }>(`${this.apiUrlBase}/transacciones/estado/${estado}`, { headers: this.getAuthHeaders() })
        .pipe(
          map(response => response.transacciones), // Extrae solo la lista de transacciones
          catchError(this.handleError) // Maneja errores
        );
    }  

   /**
   * Actualiza el estado de una transacción (aprobar/rechazar).
   * @param idTransaccion ID de la transacción a actualizar.
   * @param accion Acción a realizar ('aprobar' o 'rechazar').
   * @returns Observable con la respuesta del backend.
   */

   actualizarEstadoTransaccion(idTransaccion: string, accion: string): Observable<any> {
    const url = `${this.apiUrlBase}/transaccion/AR/${idTransaccion}/accion`; 
    const body = { accion }; 
    return this.http.patch(url, body, { headers: this.getAuthHeaders() })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al actualizar estado:', error);
        if (error.status === 400) {
          console.error('Detalles del error:', error.error); // Muestra el mensaje del servidor
        }
        return throwError(() => new Error('Error al actualizar estado de la transacción'));
      })
    );
      
  }
  

  /**
   * Maneja errores de las solicitudes HTTP.
   * @param error Error HTTP.
   * @returns Observable con un mensaje de error.
   */
  private handleError(error: HttpErrorResponse) {
    const mensaje = error.error instanceof ErrorEvent 
      ? `Error del cliente: ${error.error.message}`
      : `Código de error: ${error.status}, mensaje: ${error.message}`;
    console.error(mensaje);
    return throwError(() => new Error('Ocurrió un error al comunicarse con el servidor.'));
  }

   // Método para obtener una transacción por su ID
   
   obtenerTransaccionPorId(id: string): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.apiUrlBase}/obtenerTranssaccionId/${id}`).pipe(
      map((data: Transaccion) => {
        return data;  
      }),
      catchError((error) => {
        console.error('Error al obtener la transacción:', error);
        throw error;  
      })
    );
  }
}


