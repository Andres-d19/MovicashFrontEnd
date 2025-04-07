import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdvertenciaService } from '../../services/advertencia.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pantalla-recuperacion',
  templateUrl: './pantalla-recuperacion.component.html',
  styleUrls: ['./pantalla-recuperacion.component.css']
})
export class PantallaRecuperacionComponent {
  correo: string = '';
  mensaje: string = '';
  mostrarMensaje: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private advertenciaService: AdvertenciaService // Inyección del servicio
  ) {}

  // Método para manejar errores HTTP
  handleHttpError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Muestra un Swal en caso de error 401 (Unauthorized)
      Swal.fire({
        icon: 'warning',
        title: 'Error de autenticación',
        text: 'Parece que tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar.',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir al login
          window.location.href = '/pantalla-login';  // Cambia '/login' por la ruta correspondiente
        }
      });
    }
  }
  autenticacion() {
    if (!this.correo) {
      this.mensaje = 'Por favor, ingrese su correo electrónico';
      this.mostrarMensaje = true;
      this.advertenciaService.mostrarError('Error', this.mensaje); // Usando el servicio para mostrar el error
      return;
    }

    this.authService.recoverPassword(this.correo).subscribe(
      (response) => {
        this.mensaje = `Contraseña temporal: ${response.tempPassword}`;
        Swal.fire({
                  html: `
                    <div class="swal-logo">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                        <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                        <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                        <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                        <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                      </svg>
                    </div>
                    <h2 class="swal-title">ÉXITO</h2>
                    <p class="swal-text">Se envio la contraseña Temporal al correo <strong>${this.correo}</strong></p>
                  `,
                  icon: "success",
                  customClass: {
                    popup: "custom-swal",
                  },
                  showConfirmButton: true,
                });
        
                // Agregar estilos personalizados
                const style = document.createElement("style");
                style.innerHTML = `
                  .custom-swal {
                   position: relative;
                   border-radius: 10px;
                   overflow: hidden;
                  }
                  .swal-logo {
                  position: absolute;
                  top: 15px;
                  left: 15px;
                  z-index: 10;
                  }
                 .swal-title {
                  margin-top: 15px;
                  font-size: 24px;
                  font-weight: bold;
                  color: #333;
                  letter-spacing: 1px;
                  }
                 .swal-text {
                 font-size: 16px;
                 margin: 10px 0 25px;
                 color: #555;
                 }
        
                .swal2-actions {
                 margin-top: 0 !important;
                 gap: 15px;
                }
                .swal2-confirm, .swal2-cancel {
                padding: 12px 24px !important;
                 font-size: 15px !important;
                 font-weight: 500 !important;
                 border-radius: 4px !important;
                 min-width: 120px !important;
                background-color: #164474 !important;
                 
          }`;
                document.head.appendChild(style);
                
      },
      (error) => {
        this.mensaje = error.error?.error || 'Error al recuperar la contraseña Porfavor ingresa un correo electronico valido ';
        
       Swal.fire({
        html: `<div class="swal-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
              <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
              <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
              <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
              <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
            </svg>
          </div>
          <h2 class="swal-title">ERROR</h2>
        <p class="swal-text">${error.error?.message || 'Correo INVALIDO'}</p>`,
        icon: "error",
        customClass: {
          popup: "custom-swal",
           confirmButton: "custom-confirm-button",
        },
        showConfirmButton: true,
      });
      
      // Agregar estilos personalizados
      const style = document.createElement("style");
      style.innerHTML = `
        .custom-swal {
         position: relative;
         border-radius: 10px;
         overflow: hidden;
        }
        .swal-logo {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 10;
        }
       .swal-title {
        margin-top: 15px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        letter-spacing: 1px;
        }
       .swal-text {
       font-size: 16px;
       margin: 10px 0 25px;
       color: #555;
       }
      
      .swal2-actions {
       margin-top: 0 !important;
       gap: 15px;
      }
      .swal2-confirm, .swal2-cancel {
      padding: 12px 24px !important;
       font-size: 15px !important;
       font-weight: 500 !important;
      border-radius: 4px !important;
      background-color: #164474 !important; 
      border-color: #164474 !important;
      color: white !important;
      
      min-width: 120px !important;
      }`;
      document.head.appendChild(style);      }
    );
  }
  
}
