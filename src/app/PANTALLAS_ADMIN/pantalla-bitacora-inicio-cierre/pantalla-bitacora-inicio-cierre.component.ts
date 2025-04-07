import { Component } from '@angular/core';
import { ActivityService } from '../../services/ADMINISTRADOR/bitacoraInicioCierreSecion';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-bitacora-inicio-cierre',
  templateUrl: './pantalla-bitacora-inicio-cierre.component.html',
  styleUrl: './pantalla-bitacora-inicio-cierre.component.css'
})
export class PantallaBitacoraInicioCierreComponent {
  historial: any[] = [];
  roles: string[] = ['Administrador', 'Operador', 'Ordenante'];
  rolSeleccionado: string = 'Administrador';
  constructor(private activityService: ActivityService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }
  
  cargarHistorial() {

    console.log("Se ejecutó cargarHistorial()");

    this.activityService.obtenerHistorial(this.rolSeleccionado).subscribe(
      (data: any[]) => {
        console.log("Datos recibidos:", data);
        if (data.length === 0) {
          this.snackBar.open('No hay registros disponibles.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snack']
          });
        }
        this.historial = data.map(item => ({
          RFC: item.RFC,
          Rol: item.Rol,
          Accion: item.Acciones.Accion,  
          Detalles: item.Acciones.Detalles,  
          Fecha: item.Acciones.Fecha  
        }));
      },
      (error) => {
              console.log("error al cargar el historico")
            }
           );
    }
  
}
