import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';


export interface Transaccion {
  IdComprobante: string | undefined;                  
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
export class TransaccionService {
  private readonly apiUrlBase = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerTodasTransacciones(): Observable<Transaccion[]> {
    return this.http.get<{ success: boolean, transacciones: Transaccion[] }>(
      `${this.apiUrlBase}/transacciones/obtenerTranssacciones`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.transacciones),
      catchError(this.handleError)
    );
  }

  filtrarPorId(id: string): Observable<Transaccion[]> {
    return this.obtenerTodasTransacciones().pipe(
      map(transacciones => transacciones.filter(t => t.IdComprobante?.includes(id)))
    );
  }

  filtrarPorEstado(estado: string): Observable<Transaccion[]> {
    return this.http.get<{ success: boolean, transacciones: Transaccion[] }>(
      `${this.apiUrlBase}/transacciones/estado/${estado}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.transacciones),
      catchError(this.handleError)
    );
  }

  filtrarPorFecha(transacciones: Transaccion[], fechaInicio: Date, fechaFin: Date): Transaccion[] {
    return transacciones.filter(t => {
      const fechaTrans = new Date(t.Fecha);
      return fechaTrans >= fechaInicio && fechaTrans <= fechaFin;
    });
  }
  
  private handleError(error: any) {
    console.error('Error en el servicio:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }
}
