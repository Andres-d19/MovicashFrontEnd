import { Component } from '@angular/core';
import { TransaccionService, Transaccion } from '../../services/ADMINISTRADOR/bitacora-transacciones.servise';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pantalla-bitacora-transacciones',
  templateUrl: './pantalla-bitacora-transacciones.component.html',
  styleUrl: './pantalla-bitacora-transacciones.component.css'
})
export class PantallaBitacoraTransaccionesComponent {
  transacciones: Transaccion[] = [];
  transaccionesFiltradas: Transaccion[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  filterForm: FormGroup;
  estados = ['Todos', 'Pendiente', 'Aprobado', 'Cancelado'];

  constructor(
    private transaccionService: TransaccionService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      id: [''],
      estado: ['Todos'],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }
  ngOnInit(): void {
    this.cargarTransacciones();
    this.filterForm.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  cargarTransacciones(): void {
    this.isLoading = true;
    this.transaccionService.obtenerTodasTransacciones().subscribe({
      next: (data) => {
        this.transacciones = data;
        this.transaccionesFiltradas = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el historial de transacciones';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros(): void {
    const { id, estado, fechaInicio, fechaFin } = this.filterForm.value;
    let resultados = [...this.transacciones];
  
    // Filtro pot ID
    if (id) {
      resultados = resultados.filter(t => 
        t.IdComprobante?.toLowerCase().includes(id.toLowerCase())
      );
    }
  
    // Filtro por estado
    if (estado && estado !== 'Todos') {
      resultados = resultados.filter(t => t.Estado === estado);
    }
  
    // Filtro por fecha
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      resultados = this.transaccionService.filtrarPorFecha(resultados, inicio, fin);
    }
  
    this.transaccionesFiltradas = resultados;
  }

  limpiarFiltros(): void {
    this.filterForm.reset({
      estado: 'Todos',
      id: '',
      fechaInicio: '',
      fechaFin: ''
    });
    this.transaccionesFiltradas = [...this.transacciones];
  }
}



