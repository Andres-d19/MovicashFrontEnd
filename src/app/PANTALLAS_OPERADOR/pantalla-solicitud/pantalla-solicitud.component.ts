import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ordenante } from '../../components/interface/INTERFACES-OPERADOR/ordenante';
import { TransactionRequest } from '../../components/interface/INTERFACES-OPERADOR/TransactionRequest ';
import { SolicitudService } from '../../services/OPERADORES/solicitud-trans';
import { AdvertenciaService } from '../../services/advertencia.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-pantalla-solicitud',
  templateUrl: './pantalla-solicitud.component.html',
  styleUrl: './pantalla-solicitud.component.css'
})
export class PantallaSolicitudComponent {
  busquedaOrigenControl = new FormControl('');
  busquedaDestinoControl = new FormControl('');

  ordenanteOrigen: Ordenante | null = null;
  ordenanteDestino: Ordenante | null = null;

  transaccionForm: FormGroup;

  isLoading = false;
  errorMessage = '';

  constructor(
    private soli: SolicitudService,
    private formBuilder: FormBuilder,
    private advertenciaService: AdvertenciaService
  ) {
    this.transaccionForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      concepto: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  private estilosAgregados = false;


  ngOnInit(): void {
    this.agregarEstilosPersonalizados();
  }

  private agregarEstilosPersonalizados(): void {
    if (this.estilosAgregados) return;

    const style = document.createElement("style");
    style.innerHTML = `
      .custom-swal {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        font-family: Arial, sans-serif !important;
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
        font-family: Arial, sans-serif !important;
      }
      .swal-text {
        font-size: 16px;
        margin: 10px 0 25px;
        color: #555;
        font-family: Arial, sans-serif !important;
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
        font-family: Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);
    this.estilosAgregados = true;
}


  private get logoSvg(): string {
    return `
      <div class="swal-logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
          <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
          <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
          <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
          <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
        </svg>
      </div>
    `;
  }

  private get errorIcon(): string {
    return `
      <div style="margin-top:30px; margin-bottom:20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
    `;
  }

  private get warningIcon(): string {
    return `
      <div style="margin-top:30px; margin-bottom:20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FFB020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
    `;
  }


  buscarOrdenantePorRFC(tipo: 'origen' | 'destino'): void {
    const rfc = tipo === 'origen'
      ? this.busquedaOrigenControl.value
      : this.busquedaDestinoControl.value;

    if (!rfc) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">Ingrese un RFC para buscar</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    this.soli.getOrdenantes(rfc).subscribe(
      (response: any) => {
        if (response && response.ordenante) {
          if (tipo === 'origen') {
            this.ordenanteOrigen = response.ordenante;
          } else {
            this.ordenanteDestino = response.ordenante;
          }
        } else {
          Swal.fire({
            customClass: {
              popup: "custom-swal",
            },
            html: `
              ${this.logoSvg}
              <h2 class="swal-title">BÚSQUEDA</h2>
              <p class="swal-text">No se encontró ningún ordenante con ese RFC</p>
            `,
            width: 400,
            padding: "2rem",
            confirmButtonColor: "#164474",
            confirmButtonText: "Aceptar",
          });
        }
      },
      error => {
        console.error('Error al buscar ordenante:', error);
        Swal.fire({
          customClass: {
            popup: "custom-swal",
          },
          html: `
            ${this.logoSvg}
            ${this.errorIcon}
            <h2 class="swal-title">ERROR</h2>
            <p class="swal-text">Error al buscar el ordenante</p>
          `,
          width: 400,
          padding: "2rem",
          confirmButtonColor: "#164474",
          confirmButtonText: "Aceptar",
        });
      }
    );
  }

  validarDatos(): boolean {
    if (!this.ordenanteOrigen) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">Debe seleccionar un ordenante de origen</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  
    if (!this.ordenanteDestino) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">Debe seleccionar un ordenante de destino</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  
    if (this.ordenanteOrigen.RFCOrdenante === this.ordenanteDestino.RFCOrdenante) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">El ordenante de origen y destino no pueden ser el mismo</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  
    if (!this.transaccionForm.valid) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">Complete todos los campos del formulario correctamente</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  
    const monto = this.transaccionForm.get('monto')?.value;
    if (monto > this.ordenanteOrigen.Saldo) {
      Swal.fire({
        customClass: {
          popup: "custom-swal",
        },
        html: `
          ${this.logoSvg}
          <h2 class="swal-title">VALIDACIÓN</h2>
          <p class="swal-text">El monto excede el saldo disponible</p>
        `,
        width: 400,
        padding: "2rem",
        confirmButtonColor: "#164474",
        confirmButtonText: "Aceptar",
      });
      return false;
    }
  
    return true;
  }
  
  enviarSolicitud(): void {
    if (!this.validarDatos()) {
      return;
    }
  

    this.agregarEstilosPersonalizados();

    const transactionData: TransactionRequest = {
      numeroCuentaOrdenante: this.ordenanteOrigen!.NumeroCuenta,
      numeroCuentaBeneficiario: this.ordenanteDestino!.NumeroCuenta,
      concepto: this.transaccionForm.get('concepto')?.value,
      monto: this.transaccionForm.get('monto')?.value,
      tipo: this.transaccionForm.get('tipo')?.value
    };
  
    this.isLoading = true;
    this.soli.solicitarTransaccion(transactionData)  
      .subscribe(
        response => {
          this.isLoading = false;
          if (response.success) {            
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
                <p class="swal-text">${response.message || 'Transacción procesada correctamente'}</p>
              `,
              icon: "success",
              customClass: {
                popup: "custom-swal",
              },
              showConfirmButton: true,
              confirmButtonColor: "#164474",
              confirmButtonText: "Aceptar",
            });
            
            console.log(transactionData);
            this.limpiarDatos();
  
            // es opcional mandar a la pagina de zaida para ver el listado de trasaccione
            //this.router.navigate(['/transacciones/historial']);
          } else {
            Swal.fire({
              customClass: {
                popup: "custom-swal",
              },
              html: `
                ${this.logoSvg}
                ${this.errorIcon}
                <h2 class="swal-title">ERROR</h2>
                <p class="swal-text">${response.error || 'Error al procesar la solicitud'}</p>
              `,
              width: 400,
              padding: "2rem",
              confirmButtonColor: "#164474",
              confirmButtonText: "Aceptar",
            });
            console.log(this.errorMessage);
          }
        },
        error => {
          this.isLoading = false;
          console.log(error);
          Swal.fire({
            customClass: {
              popup: "custom-swal",
            },
            html: `
              ${this.logoSvg}
              ${this.errorIcon}
              <h2 class="swal-title">ERROR</h2>
              <p class="swal-text">Error al enviar la solicitud: ${error.error?.error || error.message || 'Error de conexión'}</p>
            `,
            width: 400,
            padding: "2rem",
            confirmButtonColor: "#164474",
            confirmButtonText: "Aceptar",
          });
        }
      );
  }

  limpiarDatos(): void{
    this.transaccionForm.reset();
    this.busquedaOrigenControl.reset();
    this.busquedaDestinoControl.reset();
    this.ordenanteOrigen = null;
    this.ordenanteDestino = null;
  }

  cancelar(): void {
    Swal.fire({
      customClass: {
        popup: "custom-swal",
      },
      html: `
        ${this.logoSvg}
        ${this.warningIcon}
        <h2 class="swal-title">ADVERTENCIA</h2>
        <p class="swal-text">¿Está seguro de cancelar la transacción?</p>
      `,
      width: 400,
      padding: "2rem",
      showCancelButton: true,
      confirmButtonColor: "#164474",
      cancelButtonColor: "#333333",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.transaccionForm.reset({
          tipo: '' 
        });
        this.busquedaOrigenControl.reset();
        this.busquedaDestinoControl.reset();
        this.ordenanteOrigen = null;
        this.ordenanteDestino = null;
      }
    });
  }

  // Método para mostrar mensajes usando el servicio de advertencia
  mostrarMensaje(titulo: string, mensaje: string): void {
    this.advertenciaService.mostrarError(titulo, mensaje);
  }


}