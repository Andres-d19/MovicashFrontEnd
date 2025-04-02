import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

/**
 * Interfaz que define la estructura de una transacción.
 */
export interface Transaccion {
  IdComprobante: string;
  NombreCompletoOrdenante: string;
  Monto: number;
  Tipo?: string;
  Fecha: string;
  Estado: string;
  Concepto: string;
}

@Injectable({
  providedIn: 'root' 
})
export class BitacoraService {
  /** Base URL del backend */
  private readonly apiUrlBase = 'http://localhost:8090/transacciones';

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
    return this.http.get<{ success: boolean, transacciones: Transaccion[] }>(`${this.apiUrlBase}/obtenerTranssacciones`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.transacciones),
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza el estado de una transacción (aprobar/rechazar).
   * @param idTransaccion ID de la transacción a actualizar.
   * @param accion Acción a realizar ('aprobar' o 'rechazar').
   * @param motivo Motivo del rechazo (opcional).
   * @returns Observable con la respuesta del backend.
   */
  actualizarEstadoTransaccion(idTransaccion: string, accion: string, motivo?: string) {
    const url = `${this.apiUrlBase}/AR/${idTransaccion}/accion`;
    const body = motivo ? { accion, motivo } : { accion };
    return this.http.patch(url, body, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los detalles de una transacción específica.
   * @param idTransaccion ID de la transacción.
   * @returns Observable con los detalles de la transacción.
   */
  obtenerDetallesTransaccion(idTransaccion: string) {
    return this.http.get<Transaccion>(`${this.apiUrlBase}/report/${idTransaccion}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
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
}
