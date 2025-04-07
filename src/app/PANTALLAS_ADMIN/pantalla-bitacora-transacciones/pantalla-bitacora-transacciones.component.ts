import { Component, AfterViewInit } from '@angular/core';
import { TransaccionService, Transaccion } from '../../services/ADMINISTRADOR/bitacora-transacciones.servise';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pantalla-bitacora-transacciones',
  templateUrl: './pantalla-bitacora-transacciones.component.html',
  styleUrls: ['./pantalla-bitacora-transacciones.component.css']
})
export class PantallaBitacoraTransaccionesComponent implements AfterViewInit {
  transacciones: Transaccion[] = [];
  transaccionesFiltradas: Transaccion[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  filterForm: FormGroup;
  estados = ['Todos', 'Pendiente', 'Aprobado', 'Cancelado'];
  isModalOpen = false;  // Control de apertura del modal

  // Nuevo: Variable para almacenar la transacción seleccionada para el modal
  transaccionSeleccionada: Transaccion | null = null;

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

  ngAfterViewInit(): void {
    // No necesitas inicializar el modal manualmente con Bootstrap si usas la propiedad isModalOpen
  }

  abrirDetalleTransaccion(transaccion: Transaccion): void {
    this.transaccionSeleccionada = transaccion;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.transaccionSeleccionada = null;
  }

  isValidMonto(monto: any): string {
    if (isNaN(monto) || monto === null || monto === undefined) {
      return 'Monto no disponible';
    }
    // Formato de moneda para México
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
  }

  cargarTransacciones(): void {
    this.isLoading = true;
    this.transaccionService.obtenerTodasTransacciones().subscribe({
      next: (data) => {
        console.log("Transacciones cargadas:", data);  // Verifica cuántas transacciones llegan
        this.transacciones = data;
        this.transaccionesFiltradas = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.log("Error al cargar el histórico:", error);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar las transacciones. Por favor, intente nuevamente.';
      }
    });
  }

  aplicarFiltros(): void {
    const { id, estado, fechaInicio, fechaFin } = this.filterForm.value;
    let resultados = [...this.transacciones];

    // Filtro por ID
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
