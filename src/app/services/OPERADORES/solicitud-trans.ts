import { OrdenanteResponse } from "../../components/interface/INTERFACES-OPERADOR/ordenante-response";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { TransactionRequest } from "../../components/interface/INTERFACES-OPERADOR/TransactionRequest ";
import { TransactionResponse } from "../../components/interface/INTERFACES-OPERADOR/TransactionResponse ";

@Injectable({
  providedIn: 'root'
})
export class SolicitudService{
  private API_URI = 'http://localhost:8090';

  constructor(private http : HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getOrdenantes(rfc: string): Observable<OrdenanteResponse> {
    return this.http.get<OrdenanteResponse>(
      `${this.API_URI}/ordenante/getOrdenanteByRFC/${rfc}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  solicitarTransaccion(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(
      `${this.API_URI}/transacciones/solicitar`, 
      transactionData, 
      { headers: this.getAuthHeaders() }
    );
  }

}

