import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ordenante } from '../../components/interface/INTERFACES-OPERADOR/ordenante';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionRequest } from '../../components/interface/INTERFACES-OPERADOR/TransactionRequest ';
import { SolicitudService } from '../../services/OPERADORES/solicitud-trans';
import { AdvertenciaService } from '../../services/advertencia.service';

import { Router } from '@angular/router';
import { error, log } from 'console';


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
    private advertenciaService: AdvertenciaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.transaccionForm = this.formBuilder.group({
      tipo: ['transferencia', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      concepto: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void { }

  buscarOrdenantePorRFC(tipo: 'origen' | 'destino'): void {
    const rfc = tipo === 'origen'
      ? this.busquedaOrigenControl.value
      : this.busquedaDestinoControl.value;

    if (!rfc) {
      this.mostrarMensaje('Validación', 'Ingrese un RFC para buscar');
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
          this.mostrarMensaje('Búsqueda', 'No se encontró ningún ordenante con ese RFC');
        }
      },
      error => {
        console.error('Error al buscar ordenante:', error);
        this.mostrarMensaje('Error', 'Error al buscar el ordenante');
      }
    );
  }

  validarDatos(): boolean {
    if (!this.ordenanteOrigen) {
      this.mostrarMensaje('Validación', 'Debe seleccionar un ordenante de origen');
      return false;
    }
  
    if (!this.ordenanteDestino) {
      this.mostrarMensaje('Validación', 'Debe seleccionar un ordenante de destino');
      return false;
    }
  
    if (this.ordenanteOrigen.RFCOrdenante === this.ordenanteDestino.RFCOrdenante) {
      this.mostrarMensaje('Validación', 'El ordenante de origen y destino no pueden ser el mismo');
      return false;
    }
  
    if (!this.transaccionForm.valid) {
      this.mostrarMensaje('Formulario', 'Complete todos los campos del formulario correctamente');
      return false;
    }
  
    const monto = this.transaccionForm.get('monto')?.value;
    if (monto > this.ordenanteOrigen.Saldo) {
      this.mostrarMensaje('Saldo insuficiente', 'El monto excede el saldo disponible');
      return false;
    }
  
    return true;
  }
  
  enviarSolicitud(): void {
    if (!this.validarDatos()) {
      return;
    }
  
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
            this.mostrarMensaje('Éxito', response.message);
            console.log(transactionData);
            this.limpiarDatos()

            // es opcional, mandar a la pagina de zaida para ver el listado de trasaccione
            //this.router.navigate(['/transacciones/historial']);
          } else {
            this.mostrarMensaje('Error', response.error || 'Error al procesar la solicitud');
            console.log(this.errorMessage);
            
          }
        },
        error => {
          this.isLoading = false;
          console.log(error)
          this.mostrarMensaje('Error', `Error al enviar la solicitud: ${error.error?.error || error.message || 'Error de conexión'}`);
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
    this.transaccionForm.reset();
    this.busquedaOrigenControl.reset();
    this.busquedaDestinoControl.reset();
    this.ordenanteOrigen = null;
    this.ordenanteDestino = null;
  }

  // Método para mostrar mensajes usando el servicio de advertencia
  mostrarMensaje(titulo: string, mensaje: string): void {
    this.advertenciaService.mostrarError(titulo, mensaje);
  }


}