import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8090/activity/getActivity';

  constructor(private http: HttpClient) {}

  obtenerHistorial(rol: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<any>(`${this.apiUrl}?rol=${rol}`, { headers });
  }
}
