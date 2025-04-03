import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaAhorroService {
  private apiUrl = 'http://localhost:8090/transaccion/depositoCuantaAhorro';  // URL de la API

  constructor(private http: HttpClient) {}

  // Servicio para realizar el depósito y obtener el saldo actualizado
  depositarYObtenerSaldo(numeroCuenta: string, monto: number, rfcOrdenante: string): Observable<any> {
    return this.http.patch<any>(this.apiUrl, {
      NumeroCuenta: numeroCuenta,
      monto: monto,
      RFCOrdenante: rfcOrdenante
    });
  }
}
