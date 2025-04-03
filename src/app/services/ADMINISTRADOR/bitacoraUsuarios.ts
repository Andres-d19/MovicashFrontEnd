import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry, tap, throwError, map } from 'rxjs';

export interface Admin {
  _id: string;
  RFC: string;
  NombrePersonal: string;
  ApPaterno: string;
  ApMaterno?: string;
  Sexo: string;
  FechaNacimiento: string;
  CorreoElectronico: string;
  Password: string;
  Rol: string;
  Direccion: {
    NumeroInterior?: string;
    NumeroExterior: string;
    Calle: string;
    Colonia: string;
    Ciudad: string;
    _id: string;
  };
  Telefono: Array<{
    Lada: string;
    Numero: string;
    _id: string;
  }>;
  Estado: string;
  FechaCreacion: string;
  FechaActualizacion: string;
  FechaUltimaModificacion?: string;
}

export interface ApiResponse {
  message: string;
  data: {
    usuarios: Admin[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private baseUrl = 'http://localhost:8090'; // Cambia si tu backend tiene otro puerto/base
  // filtroSeleccionado: string | undefined;
  // valorBusqueda: any;
  // token: any;
  // resultados: any;

  constructor(private http: HttpClient) { }

  // Método para generar encabezados con el JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encuentra el tocken malditos');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerUsuarios(): Observable<Admin[]> {
    console.log("Iniciando metodo");
    return this.http.get<ApiResponse>(`${this.baseUrl}/filtros/getAllUsers`, { 
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data.usuarios), // Extraer el array de usuarios de la respuesta
      catchError(this.handleError),
    );
  }

  filtrarUsuariosLocal(usuarios: Admin[], filtro: string): Admin[] {
    const searchTerm = filtro.toLowerCase();
    
    // Check if search term looks like a date (contains numbers and / or -)
    const isDateLike = /^\d{1,2}[/-]?\d{0,2}[/-]?\d{0,4}$/.test(searchTerm);
    
    return usuarios.filter(usuario => {
      if (isDateLike) {
        // Format the database date
        const dbDate = new Date(usuario.FechaCreacion);
        const formattedDbDate = dbDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        // Remove any - characters and convert to just numbers for partial matching
        const cleanSearchTerm = searchTerm.replace(/[-/]/g, '');
        const cleanDbDate = formattedDbDate.replace(/\//g, '');
        
        return cleanDbDate.startsWith(cleanSearchTerm);
      }
      
      // Regular text search for other fields
      return usuario.RFC.toLowerCase().includes(searchTerm) ||
        usuario.NombrePersonal.toLowerCase().includes(searchTerm) ||
        usuario.ApPaterno.toLowerCase().includes(searchTerm) ||
        usuario.CorreoElectronico.toLowerCase().includes(searchTerm) ||
        usuario.Rol.toLowerCase().includes(searchTerm);
    });
}
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para acceder a este recurso.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado, todo mal.';
    }

    console.error('Error', error);
    return throwError(() => new Error(errorMessage));
  }

  // getUsuariosFiltrados(filtros: any): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   let params = new HttpParams();

  //   if (filtros.Rol) {
  //     params = params.set('rol', filtros.Rol);
  //   }

  //   if (filtros.RFCOrdenante) {
  //     params = params.set('RFCOrdenante', filtros.RFCOrdenante);
  //   }

  //   if (filtros.FechaCreacion) {
  //     const fechaFormateada = new Date(filtros.FechaCreacion).toISOString().split('T')[0];
  //     params = params.set('FechaCreacion', fechaFormateada);
  //   }

  //   return this.http.get<any>(`${this.baseUrl}/filter/filterUsers/FechaCreacion`, { headers, params });
  // }

  // obtenerBusquedaRol(rol: string): Observable<BitacoraService[]> {
  //   return this.http.get<BitacoraService[]>(`${this.baseUrl}/filter/filterUsers/rol${rol}`, { headers: this.getHeaders() })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // obtenerBusquedaRFC(RFCOrdenante: string): Observable<BitacoraService[]> {
  //   // Verificar que la URL sea correcta
  //   return this.http.get<BitacoraService[]>(`${this.baseUrl}/filter/filterUsers/RFCOrdenante${RFCOrdenante}`)
  //     .pipe(
  //       // Añadir console.log para depuración
  //       tap(response => console.log('Respuesta de búsqueda por marca:', response)),
  //       catchError(error => {
  //         console.error('Error en búsqueda por marca:', error);
  //         if (error.status === 404) {
  //           return of([]);
  //         }
  //         return this.handleError(error);
  //       })
  //     );
  // }

  // private handleError(error: HttpErrorResponse): Observable<never> {
  //   let errorMessage = '';

  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     if (error.status === 0) {
  //       errorMessage = 'No se pudo conectar al servidor. Verifique su conexión o que el servidor esté activo.';
  //     } else if (error.status === 404) {
  //       errorMessage = 'Recurso no encontrado. Verifique la URL o los parámetros de búsqueda.';
  //     } else {
  //       errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
  //     }
  //   }

  //   console.error(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }
}
