import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  updatePasswordForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  
  // Variables para controlar la visibilidad de las contraseñas
  showTempPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    this.updatePasswordForm = this.fb.group({
      correo: [localStorage.getItem('userEmail') || '', [Validators.required, Validators.email]], // Si es null, asigna una cadena vacía
      tempPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/), // Al menos una mayúscula
        Validators.pattern(/[\W_]/)  // Al menos un carácter especial
      ]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.passwordMatchValidator
    });
    
    
  }

  // Métodos para alternar la visibilidad de las contraseñas
  toggleTempPasswordVisibility() {
    this.showTempPassword = !this.showTempPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmNewPassword')?.value;
    
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Métodos para obtener controles individuales
  get correo() {
    return this.updatePasswordForm.get('correo');
  }

  get tempPassword() {
    return this.updatePasswordForm.get('tempPassword');
  }

  get newPassword() {
    return this.updatePasswordForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.updatePasswordForm.get('confirmNewPassword');
  }

  actualizarPassword() {
    console.log('actualizando');
    if (this.updatePasswordForm.valid) {
      const { tempPassword, newPassword, confirmNewPassword } = this.updatePasswordForm.value;
      
      // Verificar que las contraseñas coinciden
      if (newPassword !== confirmNewPassword) {
        this.error = 'Las contraseñas no coinciden.';
        this.mensaje = '';
        return;
      }

      // Agregar console.log para ver los datos que se están enviando
      const correo: string = localStorage.getItem('userEmail')!; // Usamos el operador `!` para indicar que no es null
      console.log('Datos enviados:', { correo, tempPassword, newPassword });

      const userRole = localStorage.getItem('role');
      console.log("Este es el rol: ", userRole);

      this.authService.updatePassword(correo, tempPassword, newPassword).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);  // Agregar log para ver la respuesta
          this.mensaje = 'Contraseña actualizada con éxito.';
          this.error = '';
          this.updatePasswordForm.reset();
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
              <p class="swal-text">Contraseña ACTUALIZADA correctamente</p>
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
    }`;
          document.head.appendChild(style);
  
          switch (userRole) {
            case 'Admin':
              this.router.navigate(['/pantalla-adminDashboard']);
              break;
            case 'Operador':
              this.router.navigate(['/pantalla-OperadorDashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña:', err);  // Log del error
          this.error = 'Error al actualizar la contraseña: ' + (err.error?.message || err.message || 'Error desconocido');
          this.mensaje = '';
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos correctamente.';
      this.mensaje = '';
    }
  }
}
