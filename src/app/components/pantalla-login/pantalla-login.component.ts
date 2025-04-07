import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdvertenciaService } from '../../services/advertencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-login',
  templateUrl: './pantalla-login.component.html',
  styleUrls: ['./pantalla-login.component.css']
})
export class PantallaLoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private advertenciaService: AdvertenciaService
  ) {}

  // Función para manejar el login
  login() {
    if (!this.correo || !this.password) {
      this.errorMessage = 'Por favor, ingrese su correo y contraseña.';
      this.successMessage = '';
      this.advertenciaService.mostrarError('Error de Inicio de Sesión', this.errorMessage);
      return;
    }

    this.authService.login(this.correo, this.password).subscribe(
      (response) => {

        // Guardar el correo en localStorage para su uso en la verificación del código
        localStorage.setItem('userEmail', this.correo);
        localStorage.setItem('password',this.password);
        this.router.navigate(['/pantalla-verificacion-codigo']);
      },
      (error) => {
        Swal.fire({
                 html: `<div class="swal-logo">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                       <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                       <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                       <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                       <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                     </svg>
                   </div>
                   <h2 class="swal-title">ERROR DE VERIFICACION</h2>
                   <p class="swal-text">${error.error?.message || 'Correo o contraseña incorrectos'}</p>`,
                 icon: "error",
                 customClass: {
                   popup: "custom-swal",
                   confirmButton: "swal2-cancel",
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
               .swal2-cancel {
         padding: 12px 24px !important;
         font-size: 15px !important;
         font-weight: 500 !important;
         border-radius: 4px !important;
         min-width: 120px !important;
         background-color:rgb(15, 15, 94) !important; /* Azul marino */
         color: white !important;
         border: none !important;
       }
       `;
               document.head.appendChild(style);
      }
    );
  }
  togglePassword() {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    }
  }
  
}
