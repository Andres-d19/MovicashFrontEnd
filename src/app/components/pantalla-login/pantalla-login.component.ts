import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AdvertenciaService } from '../../services/advertencia.service';

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
        this.advertenciaService.mostrarError('Error de Inicio de Sesión Usuario o contraseña incorrectos', this.errorMessage);
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
