import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/OPERADORES/notificacion-service.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-pantalla-operador-dashboard',
  templateUrl: './pantalla-operador-dashboard.component.html',
  styleUrls: ['./pantalla-operador-dashboard.component.css']
})
export class PantallaOperadorDashboardComponent implements OnInit, OnDestroy {
  
  nombreUsuario: string = 'Usuario';
  rfcOperador: string = '';
  
  // Propiedades para notificaciones
  notificaciones: any[] = [];
  mostrarNotificaciones: boolean = false;
  cantidadNotificaciones: number = 0;
  componenteActivo: boolean = true;
  notificacionSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarNombreUsuario();
  
    const notificacionesAlmacenadas = this.notificacionService.obtenerNotificacionesAlmacenadas();
    if (notificacionesAlmacenadas.length > 0) {
      this.notificaciones = notificacionesAlmacenadas;
      this.cantidadNotificaciones = this.notificaciones.filter(n => !n.leida).length;
    }
    this.iniciarActualizacionPeriodicaNotificaciones();

  }

  ngOnDestroy(): void {
    this.componenteActivo = false;
    if (this.notificacionSubscription) {
      this.notificacionSubscription.unsubscribe();
    }
    this.guardarNotificacionesEnStorage();
  }

  mostrarNotificacionesAlmacenadas(): void {
    const stored = localStorage.getItem('movicash_notificaciones');
    if (stored) {
      this.notificaciones = JSON.parse(stored);
      this.cantidadNotificaciones = this.notificaciones.length;
    }
  }
  
  cargarNotificacionesGuardadas(): void {
    const notificacionesGuardadas = localStorage.getItem('movicash_notificaciones');
    if (notificacionesGuardadas) {
      this.notificaciones = JSON.parse(notificacionesGuardadas);
      this.notificaciones = this.notificaciones.map(n => ({
        ...n,
        leida: true
      }));
      this.guardarNotificacionesEnStorage();
    }
  }

  guardarNotificacionesEnStorage(): void {
    if (this.notificaciones.length > 0) {
      localStorage.setItem('movicash_notificaciones', JSON.stringify(this.notificaciones));
    }
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.closest('.campana-icon') || target.closest('.panel-notificaciones')) {
      return;
    }
    
    if (this.mostrarNotificaciones) {
      this.mostrarNotificaciones = false;
    }
  }

  cargarNombreUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    this.authService.getUserName().subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        
        if (response && response.nombreUsuario) {
          // La respuesta contiene un array de objetos
          if (Array.isArray(response.nombreUsuario) && response.nombreUsuario.length > 0) {
            const primerUsuario = response.nombreUsuario[0];
            
            // Extraer el NombrePersonal del primer elemento del array
            if (primerUsuario && primerUsuario.NombrePersonal) {
              this.nombreUsuario = primerUsuario.NombrePersonal;
              
              // Obtener el RFC del mismo objeto
              if (primerUsuario.RFC) {
                this.rfcOperador = primerUsuario.RFC;
                console.log('RFC del operador:', this.rfcOperador);
                
                // Una vez que tenemos el RFC, cargamos las notificaciones
                this.cargarNotificaciones();
                this.iniciarActualizacionPeriodicaNotificaciones();
              }
            } else {
              this.nombreUsuario = 'Usuario';
            }
          } else {
            this.nombreUsuario = 'Usuario';
          }
        } else {
          this.nombreUsuario = 'Usuario';
        }
        
        console.log('Nombre de usuario establecido:', this.nombreUsuario);
      },
      (error) => {
        console.error('Error al obtener el nombre del usuario:', error);
        this.nombreUsuario = 'Usuario';
      }
    );
  }

  // Métodos para notificaciones
  cargarNotificaciones(): void {
    if (!this.rfcOperador) {
      console.warn('No se puede cargar notificaciones: RFC no disponible');
      return;
    }
    
    console.log('Cargando notificaciones para RFC:', this.rfcOperador);
    
    this.notificacionService.obtenerNotificaciones(this.rfcOperador).subscribe(
      (response: any) => {
        console.log('Respuesta de notificaciones:', response);
        
        if (response && response.notificaciones) {
          this.notificaciones = response.notificaciones;
          this.cantidadNotificaciones = this.notificaciones.length;
        }
      },
      (error: any) => {
        console.error('Error al cargar notificaciones:', error);
        // No borrar las notificaciones existentes en caso de error
      }
    );
  }

  iniciarActualizacionPeriodicaNotificaciones(): void {
    // Actualizar cada 30 segundos
    this.notificacionSubscription = interval(30000)
      .pipe(
        takeWhile(() => this.componenteActivo),
        switchMap(() => this.notificacionService.obtenerNotificaciones(this.rfcOperador))
      )
      .subscribe(
        (response: any) => {
          if (response && response.notificaciones) {
            // Si el número de notificaciones cambia mientras el panel está cerrado,
            // se puede mostrar una animación o sonido para alertar al usuario
            const notificacionesAnteriores = this.cantidadNotificaciones;
            
            // Intentamos conservar las notificaciones existentes y añadir solo las nuevas
            if (notificacionesAnteriores < response.notificaciones.length) {
              this.notificaciones = response.notificaciones;
              this.cantidadNotificaciones = this.notificaciones.length;
              this.guardarNotificacionesEnStorage();
              
              if (!this.mostrarNotificaciones) {
                this.animarIconoNotificacion();
              }
            }
          }
        },
        (error: any) => {
          console.error('Error al actualizar notificaciones:', error);
        }
      );
  }

  animarIconoNotificacion(): void {
    // Implementar una animación simple para el icono cuando hay notificaciones nuevas
    const campanaIcon = document.querySelector('.campana-icon');
    if (campanaIcon) {
      campanaIcon.classList.add('nueva-notificacion');
      setTimeout(() => {
        campanaIcon.classList.remove('nueva-notificacion');
      }, 1000);
    }
  }

  toggleNotificaciones(event?: MouseEvent): void {
    // Evitar que el evento de clic se propague
    if (event) {
      event.stopPropagation();
    }
  
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    
    // Solo intentar marcar como leídas si estamos abriendo el panel
    if (this.mostrarNotificaciones && this.cantidadNotificaciones > 0) {
      this.notificacionService.marcarNotificacionesComoLeidas(this.rfcOperador).subscribe(
        () => {
          console.log('Notificaciones marcadas como leídas');
          
          // Marcar como leídas localmente
          this.notificaciones = this.notificaciones.map(n => ({
            ...n,
            leida: true
          }));
    
          this.cantidadNotificaciones = 0;
          this.guardarNotificacionesEnStorage();
        },
        (error: any) => {
          console.error('Error al marcar notificaciones como leídas:', error);
        }
      );
    }
    
  }

  logout(): void {
    localStorage.removeItem('token');
    
    this.authService.logout();
    
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('estado');
    
    this.router.navigate(['/']);
  }
}