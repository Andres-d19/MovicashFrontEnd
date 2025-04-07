import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AdvertenciaService } from '../../services/advertencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-verificacion-codigo',
  templateUrl: './pantalla-verificacion-codigo.component.html',
  styleUrls: ['./pantalla-verificacion-codigo.component.css']
})
export class PantallaVerificacionCodigoComponent implements OnInit, OnDestroy {

  @ViewChildren('codeInput0, codeInput1, codeInput2, codeInput3, codeInput4, codeInput5')
  codeInputs!: QueryList<ElementRef>;

  private timer: any;
  private timeLeft: number = 360 // 6 minutes in seconds
  correo: string = '';  // Suponiendo que el correo ya está guardado desde el login
  code: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  timerFormatted: string = '06:00'; // Variable para mostrar el tiempo formateado en la vista
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private advertenciaService: AdvertenciaService
  ) { }

  ngOnInit() {
    // Esperar un pequeño retraso antes de iniciar la lógica que depende de recursos externos
    setTimeout(() => {
      this.startTimer();
      if (typeof window !== 'undefined') {  // Comprobar si estamos en el navegador
        this.correo = localStorage.getItem('userEmail') || '';
        this.password = localStorage.getItem('password') || ''; // Recuperar el correo al iniciar el componente
      }
    }, 2000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timer);
        this.reenviarCodigo(); // Llamamos a la función para reenviar el código
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerFormatted = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  onInputChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Validar que el valor ingresado sea alfanumérico
    if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
      input.value = '';
      return;
    }

    const inputs = this.codeInputs.toArray();
    if (value && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }
    if (value === '' && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }
    this.checkCompleteCode();
  }

  checkCompleteCode() {
    const inputs = this.codeInputs.toArray();
    const code = inputs.map(input => input.nativeElement.value).join('');
    if (code.length === 6 && /^[a-zA-Z0-9]+$/.test(code)) {
      this.code = code;
    }
  }

  verificarCodigo() {
    if (!this.correo) {
      this.correo = localStorage.getItem('userEmail') || '';
    }

    this.authService.verificarCodigo(this.correo, this.code).subscribe(
      (response) => {
        clearInterval(this.timer);

        if (response.token) {
          localStorage.setItem('token', response.token);
          const decodedToken: any = jwtDecode(response.token);
          const userRole = decodedToken.role;
          localStorage.setItem('role', userRole);
          const estado = decodedToken.estado;
          localStorage.setItem('estado', estado);
          if (estado === 'Inactivo') {
            this.router.navigate(['/cambiar-password']);
            return;
          }

          this.errorMessage = '';

          switch (userRole) {
            case 'Admin':
              this.router.navigate(['/pantalla-adminDashboard',{ replaceUrl: false }]);
              break;
            case 'Operador':
              this.router.navigate(['/pantalla-OperadorDashboard']);
              break;


          }
        } else {
          this.errorMessage = 'Error al recibir el token. Inténtelo de nuevo.';
          this.successMessage = '';
        }
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
            <p class="swal-text">Codigo de verificacion invalido o expirado</p>`,
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

  reenviarCodigo() {
    this.authService.login(this.correo, this.password).subscribe(
      (response) => {
        if (response) {
          this.timeLeft = 360;  // Reiniciar el contador
          this.startTimer();  // Iniciar de nuevo el temporizador
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
              <h2 class="swal-title">CODIGO EXPIRADO</h2>
              <p class="swal-text">Se envio un nuevo codigo al correo electronico <strong>${this.correo}</strong></p>
            `,
            icon: "success",
            customClass: {
              popup: "custom-swal",
              confirmButton: "swal2-confirm",

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
          .swal2-confirm {
  padding: 12px 24px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  border-radius: 4px !important;
  min-width: 120px !important;
  background-color: #000080 !important; /* Azul marino */
  color: white !important;
  border: none !important;
}
`;
          document.head.appendChild(style);
        } else {
          this.errorMessage = 'Error al enviar el código. Inténtalo nuevamente.';
        }
      },
      (error) => {
        this.errorMessage = 'Error al intentar reenviar el código. Inténtalo más tarde.';
        this.advertenciaService.mostrarError('Error', this.errorMessage);
      }
    );
  }
}
