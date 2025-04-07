import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { GestionOrdenanteService } from '../../services/OPERADORES/gestion-ordenante.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';  
import { ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';



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
      FechaNacimiento: ['', [Validators.required, this.mayorDeEdadValidator]], // Se añade la validación personalizada

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
        Ciudad: ['', Validators.required],

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
   // funcion para validar que sea mayor de edad 
   mayorDeEdadValidator(control: any) {
    if (!control.value) return null;
  
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  
    // Ajuste para considerar si ya cumplió años este año
    const mesActual = hoy.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaActual = hoy.getDate();
    const diaNacimiento = fechaNacimiento.getDate();
  
    if (
      edad > 18 ||
      (edad === 18 && (mesNacimiento < mesActual || (mesNacimiento === mesActual && diaNacimiento <= diaActual)))
    ) {
      return null; // Válido si es mayor de edad
    } else {
      return { menorDeEdad: true }; // Error si es menor de edad
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
            <p class="swal-text">Ordenante CREADO correctamente</p>
          `,
          icon: "success",
          customClass: {
            popup: "custom-swal",
            confirmButton: "confirm"
          },
          showConfirmButton: true,
        });

        // Agregar estilos personalizados
        const style = document.createElement("style");
        style.innerHTML = `
          .custom-swal {
           position: relative;
           border-radius: 10px;
           overflow: hidden;
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
          }
         .swal-text {
         font-size: 16px;
         margin: 10px 0 25px;
         color: #555;
         }

        .swal2-actions {
         margin-top: 0 !important;
         gap: 15px;
        }
        .swal2-confirm, .swal2-cancel {
        padding: 12px 24px !important;
         font-size: 15px !important;
         font-weight: 500 !important;
         background-color: #164474 !important;
         border-radius: 4px !important;
         min-width: 120px !important;
  }`;
        document.head.appendChild(style);
       ;
      },
      error => {
        Swal.fire({
          html: `<div class="swal-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
              </svg>
            </div>
            <h2 class="swal-title">ERROR</h2>
            <p class="swal-text">${error.message || "No se pudo CREAR al Ordenante"}</p>`,
          icon: "error",
          customClass: {
            popup: "custom-swal",
             confirmButton: "custom-confirm-button",
          },
          showConfirmButton: true,
        });
        
        // Agregar estilos personalizados
        const style = document.createElement("style");
        style.innerHTML = `
          .custom-swal {
           position: relative;
           border-radius: 10px;
           overflow: hidden;
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
          }
         .swal-text {
         font-size: 16px;
         margin: 10px 0 25px;
         color: #555;
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
        background-color: #164474 !important; 
        border-color: #164474 !important;
        color: white !important;
        
        min-width: 120px !important;
        }`;
        document.head.appendChild(style);
      ;
        
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
