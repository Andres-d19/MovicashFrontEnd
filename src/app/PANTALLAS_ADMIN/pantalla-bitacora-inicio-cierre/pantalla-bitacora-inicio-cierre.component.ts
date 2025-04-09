import { Component } from '@angular/core';
import { ActivityService } from '../../services/ADMINISTRADOR/bitacoraInicioCierreSecion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-bitacora-inicio-cierre',
  templateUrl: './pantalla-bitacora-inicio-cierre.component.html',
  styleUrls: ['./pantalla-bitacora-inicio-cierre.component.css']
})
export class PantallaBitacoraInicioCierreComponent {
  historial: any[] = [];
  roles: string[] = ['Administrador', 'Operador', 'Ordenante'];
  rolSeleccionado: string = 'Administrador';

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    console.log("Se ejecutó cargarHistorial()");

    this.activityService.obtenerHistorial(this.rolSeleccionado).subscribe({
      next: (data: any[]) => {
        console.log("Datos recibidos:", data);
        if (!Array.isArray(data) || data.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin registros',
            text: 'No hay registros disponibles para este rol.',
            confirmButtonColor: '#3085d6'
          });
          this.historial = [];
          return;
        }

        this.historial = data.map(item => ({
          RFC: item.RFC,
          Rol: item.Rol,
          Accion: item.Acciones?.Accion ?? 'No especificada',
          Detalles: item.Acciones?.Detalles ?? 'No disponibles',
          Fecha: item.Acciones?.Fecha ?? 'Sin fecha'
        }));
      },
      error: (error) => {
        console.error("Error al obtener historial:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el historial. Intente de nuevo.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
