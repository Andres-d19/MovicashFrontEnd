import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaAhorroService } from '../../services/OPERADORES/cuenta-ahorro.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-deposito-cuenta',
  templateUrl: './deposito-cuenta.component.html',
  styleUrls: ['./deposito-cuenta.component.css']
})
export class DepositoCuentaComponent implements OnInit {
  depositoForm: FormGroup;
  mensaje: string = '';
  saldo: number | null = null;

  constructor(private fb: FormBuilder, private cuentaAhorroService: CuentaAhorroService) {
    // Inicialización del formulario
    this.depositoForm = this.fb.group({
      numeroCuenta: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],  // Validación de cuenta numérica
      monto: ['', [Validators.required, Validators.min(1)]],  // Monto mínimo de 1
      rfcOrdenante: ['', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z]{3}$')]]  // Validación RFC
    });
  }

  ngOnInit() {
    // Aquí puedes inicializar el saldo si es necesario o realizar otras operaciones al iniciar el componente
  }
 
  // Método para realizar el depósito cuando el formulario se envía
  realizarDeposito() {
    if (this.depositoForm.valid) {
      const { numeroCuenta, monto, rfcOrdenante } = this.depositoForm.value;

      // Depuración: Mostrar los datos enviados al backend
      console.log("Datos enviados al backend:", { numeroCuenta, monto, rfcOrdenante });

      // Verifica que el monto sea mayor que 0
      if (monto <= 0) {
        this.mensaje = 'El monto debe ser mayor que 0.';
        return;
      }

      // Verifica que el RFC sea válido
      if (!rfcOrdenante || !/^[A-Z]{4}[0-9]{6}[A-Z]{3}$/.test(rfcOrdenante)) {
        this.mensaje = 'RFC Ordenante inválido.';
        return;
      }

      // Llamar al servicio para realizar el depósito y obtener el saldo actualizado al mismo tiempo
      this.cuentaAhorroService.depositarYObtenerSaldo(numeroCuenta, monto, rfcOrdenante).subscribe(
        (res) => {
          // Depuración: Mostrar la respuesta completa del backend para verificar que contiene el saldo
          console.log("Respuesta del backend:", res);

          // Actualiza el mensaje y el saldo con la respuesta del backend
          this.mensaje = res.message;

          // Asegúrate de que la propiedad 'Saldo' esté presente dentro de 'updatedOrdenante'
          if (res.updatedOrdenante && res.updatedOrdenante.Saldo !== undefined) {
            this.saldo = res.updatedOrdenante.Saldo;  // Asigna el saldo correctamente
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
                        <p class="swal-text">Saldo ACTUALIZADO correctamente</p>
                      `,
                      icon: "success",
                      customClass: {
                        popup: "custom-swal",
                        confirmButton: "confirm"
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
                     background-color: #164474 !important;
                     border-radius: 4px !important;
                     min-width: 120px !important;
              }`;
                    document.head.appendChild(style);



          } else {
            console.error("Saldo no encontrado en la respuesta del backend");
          }

          //this.depositoForm.reset();  // Restablece el formulario después de realizar el depósito
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
                      <h2 class="swal-title">ERROR</h2>
                      <p class="swal-text">${error.message}</p>`,
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
                  document.head.appendChild(style);
        }
      );
    }
  }

  // Método para validar el monto (solo permite números)
  validarMonto(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/[^0-9]/g, '');  // Elimina caracteres no numéricos
    if (valor) {
      this.depositoForm.patchValue({ monto: parseInt(valor, 10) });  // Convierte a número entero
    }
  }
}
