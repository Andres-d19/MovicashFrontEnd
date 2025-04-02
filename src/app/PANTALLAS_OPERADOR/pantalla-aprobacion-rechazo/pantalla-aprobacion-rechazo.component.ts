import { Component, OnInit } from '@angular/core';
import { BitacoraService, Transaccion } from '../../services/OPERADORES/AprobacionRechazo';

@Component({
  selector: 'app-pantalla-aprobacion-rechazo',
  templateUrl: './pantalla-aprobacion-rechazo.component.html',
  styleUrls: ['./pantalla-aprobacion-rechazo.component.css']
})
export class PantallaAprobacionRechazoComponent implements OnInit {
  transaccionesPendientes: Transaccion[] = [];
  transactionDetails: Transaccion | null = null;
  modalVisible: boolean = false;

  constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.cargarTransaccionesPendientes();
  }

  cargarTransaccionesPendientes(): void {
    this.bitacoraService.obtenerTransaccionesPendientes().subscribe({
      next: (data) => {
        // Asegurarse de que data sea un array
        if (Array.isArray(data)) {
          this.transaccionesPendientes = data;
        } else {
          console.error('Se esperaba un array, pero se recibió:', data);
        }
      },
      error: (error) => console.error('Error al cargar transacciones:', error)
    });
  }

  showTransactionInfo(transaccion: Transaccion): void {
    this.transactionDetails = transaccion;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.transactionDetails = null;
  }

  aprobarTransaccion(idTransaccion: string): void {
    this.bitacoraService.actualizarEstadoTransaccion(idTransaccion, 'aprobar').subscribe({
      next: () => {
        console.log(`Transacción ${idTransaccion} aprobada.`);
        this.cargarTransaccionesPendientes();
      },
      error: (error) => console.error('Error al aprobar transacción:', error)
    });
  }

  rechazarTransaccion(idTransaccion: string): void {
    this.bitacoraService.actualizarEstadoTransaccion(idTransaccion, 'rechazar', 'Motivo de rechazo').subscribe({
      next: () => {
        console.log(`Transacción ${idTransaccion} rechazada.`);
        this.cargarTransaccionesPendientes();
      },
      error: (error) => console.error('Error al rechazar transacción:', error)
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return 'Fecha no disponible';
    }
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Fecha no válida' : parsedDate.toLocaleString();
  }
}
