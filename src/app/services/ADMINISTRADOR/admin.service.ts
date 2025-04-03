import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8090/admin'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener el token desde localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para generar encabezados con el JWT
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los administradores
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllAdmin`, { headers: this.getHeaders() });
  }

  // // Eliminar un administrador por RFC
  // deleteAdmin(RFC: string): Observable<any> {
  //   return this.http.delete(${this.apiUrl}/deleteAdmin/${RFC}, { headers: this.getHeaders() });
  // }

   // Eliminar un administrador por RFC
  deleteAdmin(RFC: string): Observable<any> {
    console.log(`Llamando a DELETE en el servidor con RFC: ${RFC}`);
    return this.http.delete<any>(`${this.apiUrl}/deleteAdmin/${RFC}`, { headers: this.getHeaders() });
  }
  

  // Actualizar un administrador
  updateAdmin(RFC: string, adminData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateAdmin/${RFC}`, adminData, { headers: this.getHeaders() });
  }
}