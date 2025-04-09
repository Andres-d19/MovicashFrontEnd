import { Component, OnInit } from '@angular/core';
import { BitacoraService, Transaccion } from '../../services/OPERADORES/AprobacionRechazo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-aprobacion-rechazo',
  templateUrl: './pantalla-aprobacion-rechazo.component.html',
  styleUrls: ['./pantalla-aprobacion-rechazo.component.css']
})
export class PantallaAprobacionRechazoComponent implements OnInit {

  transaccionesPendientes: Transaccion[] = [];
  transactionDetails: Transaccion | null = null;
  modalVisible: boolean = false;
  transaccionesFinalizadas: any[] = [];
  idBusqueda: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  estados: string[] = ['Aprobado', 'Pendiente', 'Cancelado'];
  estadoSeleccionado: string = 'Pendiente';

  constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.cargarTransaccionesPorEstado(this.estadoSeleccionado);
  }

  cargarTransaccionesPorEstado(estado: string): void {
    this.bitacoraService.obtenerTransaccionesPorEstado(estado).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.transaccionesPendientes = data;
        } else {
          console.error('Se esperaba un array, pero se recibió:', data);
          this.errorMessage = 'Los datos recibidos no tienen el formato esperado.';
        }
      },
      error: (error) => {
        console.error('Error al cargar las transacciones por estado:', error);
        this.errorMessage = 'No se pudieron cargar las transacciones con ese estado.';
      }
    });
  }

  buscarTransaccion(): void {
    if (!this.idBusqueda.trim()) {
      return;
    }
  
    this.bitacoraService.obtenerDetallesTransaccion(this.idBusqueda).subscribe({
      next: (data) => {
        this.transaccionesPendientes = data ? [data] : [];
      },
      error: (error) => {
        console.error('Error al obtener la transacción:', error);
      }
    });
  }  

  aprobarTransaccion(idTransaccion: string): void {
    // Llamamos a advertenciaAccion con el tipo 'aprobar' y la transacción correspondiente
    this.advertenciaAccion('aprobar', { IdComprobante: idTransaccion });
  }
  
  rechazarTransaccion(idTransaccion: string): void {
    // Llamamos a advertenciaAccion con el tipo 'rechazar' y la transacción correspondiente
    this.advertenciaAccion('rechazar', { IdComprobante: idTransaccion });
  }
  
  advertenciaAccion(tipo: string, transaccion: { IdComprobante: string }): void {
    document.body.classList.remove('modal-open');
  
    // Ajustamos el título y el mensaje dependiendo del tipo (aprobar o rechazar)
    let titulo = tipo === 'aprobar' ? 'CONFIRMAR APROBACIÓN' : 'CONFIRMAR RECHAZO';
    let mensaje = tipo === 'aprobar' 
      ? '¿Seguro que quieres aprobar esta transacción?' 
      : '¿Seguro que quieres rechazar esta transacción?';
    let botonConfirmar = tipo === 'aprobar' ? 'Aprobar' : 'Rechazar';
  
    Swal.fire({
      customClass: {
        popup: 'custom-swal'
      },
      html: `
        <div class="swal-logo" style="position: absolute; top: 15px; left: 15px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
            <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
            <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
            <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
          </svg>
        </div>
        <h2 class="swal-title">${titulo}</h2>
        <p class="swal-text">${mensaje}</p>
      `,
      width: 400,
      padding: '2rem',
      showCancelButton: true,
      confirmButtonColor: '#164474',
      cancelButtonColor: '#333333',
      confirmButtonText: botonConfirmar,
      cancelButtonText: 'Cancelar',
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Dependiendo del tipo, ejecutamos la acción de aprobar o rechazar
        if (tipo === 'aprobar') {
          // Llamamos a la función para aprobar la transacción
          this.bitacoraService.actualizarEstadoTransaccion(transaccion.IdComprobante, 'Aceptar').subscribe({
            next: () => {
              this.cargarTransaccionesPorEstado(this.estadoSeleccionado);
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La transacción ha sido aprobada correctamente.',
                confirmButtonColor: '#3085d6',
                html: `
                  <div class="swal-logo" style="position: absolute; top: 15px; left: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                      <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                      <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                    </svg>
                  </div>
                `
              });
            },
            error: (error) => {
              console.error('Error al aprobar la transacción:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo aprobar la transacción.',
                confirmButtonColor: '#d33',
                html: `
                  <div class="swal-logo" style="position: absolute; top: 15px; left: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                      <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                      <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                    </svg>
                  </div>
                `
              });
            }
          });
        } else if (tipo === 'rechazar') {
          // Llamamos a la función para rechazar la transacción
          this.bitacoraService.actualizarEstadoTransaccion(transaccion.IdComprobante, 'Rechazar').subscribe({
            next: () => {
              this.cargarTransaccionesPorEstado(this.estadoSeleccionado);
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La transacción ha sido rechazada correctamente.',
                confirmButtonColor: '#3085d6',
                html: `
                  <div class="swal-logo" style="position: absolute; top: 15px; left: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                      <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                      <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                    </svg>
                  </div>
                `
              });
            },
            error: (error) => {
              console.error('Error al rechazar la transacción:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo rechazar la transacción.',
                confirmButtonColor: '#d33',
                html: `
                  <div class="swal-logo" style="position: absolute; top: 15px; left: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                      <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                      <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                      <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                      <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                    </svg>
                  </div>
                `
              });
            }
          });
        }
      }
    });
  }  

  closeModal(): void {
    this.modalVisible = false;
    this.transactionDetails = null;
  }
  showTransactionInfo(transaction: Transaccion): void {
    this.transactionDetails = transaction;
  
    this.modalVisible = true;
  }
  

  formatDate(date: string | undefined): string {
    if (!date) {
      return 'Fecha no disponible';
    }
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Fecha no válida' : parsedDate.toLocaleString();
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }
}
