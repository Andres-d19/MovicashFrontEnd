import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { GestionOrdenanteService } from '../../services/OPERADORES/gestion-ordenante.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';  
import { ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'app-alta-ordenante',
  templateUrl: './alta-ordenante.component.html',
  styleUrl: './alta-ordenante.component.css',
})
export class AltaOrdenanteComponent implements OnInit {
  
  ordenanteForm!: FormGroup;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private gestionOrdenanteService: GestionOrdenanteService,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.ordenanteForm = this.fb.group({
      RFCOrdenante: ['', [Validators.required, Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/)]],
      NombreOrdenante: ['', Validators.required],
      ApPaterno: ['', Validators.required],
      ApMaterno: [''],
      Sexo: ['', Validators.required],
      FechaNacimiento: ['', Validators.required],
      NumeroCuenta:  ['', [Validators.required, Validators.pattern(/^\d{18}$/)]],
      Saldo: [0, [Validators.required,Validators.pattern(/^\d+\.?\d{0,2}$/)]],
      Estado: ['Inactivo', Validators.required],
      FechaRegistro: [new Date()],
      Telefono: this.fb.array([this.fb.control('', [Validators.required, Validators.pattern(/^\d{7,10}$/)])]), 
      Direccion: this.fb.group({
        NumeroExterior: ['', Validators.required],
        NumeroInterior: [''],
        Calle: ['', Validators.required],
        Colonia: ['', Validators.required],
        Ciudad: ['', Validators.required]
      })
    });
  }

  // Getter para acceder a los teléfonos
  get telefonos(): FormArray {
    return this.ordenanteForm.get('Telefono') as FormArray;
  }

  // Método para agregar un nuevo teléfono
  agregarTelefono() {
    this.telefonos.push(this.fb.control('', [Validators.required, Validators.pattern(/^\d{7,10}$/)]));
  }

  // Método para eliminar un teléfono de la lista
  eliminarTelefono(index: number) {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // Formatear RFC automáticamente
  formatearRFC() {
    let valor = this.ordenanteForm.get('RFCOrdenante')?.value.toUpperCase().replace(/[^A-ZÑ&0-9]/g, '');

    // Aplicar la estructura correcta
    let letras = valor.substring(0, 4).replace(/[^A-ZÑ&]/g, '');
    let numeros = valor.substring(4, 10).replace(/[^0-9]/g, '');
    let homoclave = valor.substring(10, 13).replace(/[^A-Z0-9]/g, '');

    this.ordenanteForm.get('RFCOrdenante')?.setValue(`${letras}${numeros}${homoclave}`, { emitEvent: false });
  }

  submitForm() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.snackBar.open('No estás autenticado. Por favor, inicia sesión nuevamente.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snack-error']
      });
      return; // No enviar la solicitud si el token no está presente
    }
    if (this.ordenanteForm.invalid) {
      this.snackBar.open('Corrige los errores en el formulario antes de continuar.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snack-error']
      });
      return;
    }

    const formData = this.ordenanteForm.value;
    formData.FechaNacimiento = new Date(formData.FechaNacimiento).toISOString();
    formData.FechaRegistro = new Date(formData.FechaRegistro).toISOString();

    formData.NumeroCuenta = parseInt(formData.NumeroCuenta, 10);

    
  // Ver los datos que se están enviando
  console.log('Datos enviados:', this.ordenanteForm.value); 

    this.gestionOrdenanteService.crearOrdenante(this.ordenanteForm.value).subscribe(
      response => {
        console.log('Ordenante registrado con éxito:', response);
        this.snackBar.open('Ordenante registrado exitosamente', 'Cerrar', {
          duration: 3000, 
          verticalPosition: 'top',
          panelClass: ['snack-success']  
        });
      },
      error => {
        console.error('Error al registrar ordenante:', error);      
        // Mostrar mensaje de error específico
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'start',
          panelClass: ['top-left-snackbar']
        });
        
        // Marcar el campo específico como inválido si es un error de duplicado
        if (error.duplicateField) {
          this.ordenanteForm.get(error.duplicateField)?.setErrors({ 'duplicate': true });
        }
      }
    );
  }

  onSaldoInput(event: any) {
    const input = event.target.value;
    
    // Permite números y un solo punto decimal
    const validPattern = /^(\d+\.?\d{0.2}|\.\d{0.2})$/;
    
    if (!validPattern.test(input)) {
      event.target.value = this.ordenanteForm.get('Saldo')?.value || '';
      return;
    }
 
    const numericValue = parseFloat(input) || 0;
    this.ordenanteForm.get('Saldo')?.setValue(numericValue);
  }

  validarTexto(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]$/.test(inputChar)) {
      event.preventDefault();
    }
  }
  
}
