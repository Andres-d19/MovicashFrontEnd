import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaAhorroService } from '../../services/OPERADORES/cuenta-ahorro.service';

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
            console.log("Saldo actualizado:", this.saldo);
          } else {
            console.error("Saldo no encontrado en la respuesta del backend");
          }

          //this.depositoForm.reset();  // Restablece el formulario después de realizar el depósito
        },
        (err) => {
          console.error('Error al realizar el depósito:', err);
          this.mensaje = 'Error al procesar el depósito';
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
