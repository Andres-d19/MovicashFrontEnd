import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private API_URI = 'http://localhost:8090';
  private STORAGE_KEY = 'movicash_notificaciones';

  constructor(private http: HttpClient) { }

  obtenerNotificaciones(rfcOperador: string): Observable<any> {
    return this.http.get(`${this.API_URI}/notificacion/${rfcOperador}`).pipe(
      tap((response: any) => {
        if (response && response.notificaciones && response.notificaciones.length > 0) {
          this.almacenarNotificaciones(response.notificaciones);
        }
      }),
      catchError(error => {
        console.error('Error al obtener notificaciones:', error);
        const notificacionesAlmacenadas = this.obtenerNotificacionesAlmacenadas();
        return of({ notificaciones: notificacionesAlmacenadas });
      })
    );
  }

  marcarNotificacionesComoLeidas(rfcOperador: string): Observable<any> {
    return this.http.patch(`${this.API_URI}/notificacion/${rfcOperador}/leidas`, {}).pipe(
      catchError(error => {
        console.error('Error al marcar notificaciones como leídas:', error);
        return of({ message: 'Error al marcar como leídas, pero se mantienen visibles' });
      })
    );
  }

  private almacenarNotificaciones(notificaciones: any[]): void {
    const existentes = this.obtenerNotificacionesAlmacenadas();
  
    const nuevas = notificaciones.map(n => ({ ...n, leida: false }));
  
    const combinadas = this.combinarNotificaciones(existentes, nuevas);
  
    const limitadas = combinadas.slice(0, 10);
  
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitadas));
  }
  

  obtenerNotificacionesAlmacenadas(): any[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private combinarNotificaciones(existentes: any[], nuevas: any[]): any[] {
    const mapa = new Map();
    
    // Añadir todas las notificaciones al mapa
    [...existentes, ...nuevas].forEach(n => {
      // Usar _id o una combinación única como clave
      const id = n._id || n.transaccionId || n.mensaje;
      if (!mapa.has(id)) {
        mapa.set(id, n);
      }
    });
    
    // Convertir el mapa de vuelta a array y ordenar por fecha (mas recientes primero)
    return Array.from(mapa.values())
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }
}