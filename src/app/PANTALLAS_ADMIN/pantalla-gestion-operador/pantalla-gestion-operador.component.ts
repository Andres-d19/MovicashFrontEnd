import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";
import { OperadorService } from "../../services/ADMINISTRADOR/gestion-operador";
import Swal from "sweetalert2";

@Component({
  selector: "app-pantalla-gestion-operador",
  templateUrl: "./pantalla-gestion-operador.component.html",
  styleUrls: ["./pantalla-gestion-operador.component.css"],
})
export class PantallaGestionOperadorComponent implements OnInit {
  // Variables para controlar si estamos editando o agregando
  isEditing: boolean = false;
  editingIndex: number | null = null;
  isModalOpen: boolean = false;
  searchQuery: string = "";
  operadores: any[] = [];
  filteredOperadores: any[] = [];
  errorMessage: string = "";
  today: string = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato yyyy-mm-dd
  passwordVisible: boolean = false;
  isConfirmModalOpen: boolean = false;
  operadorAEliminar: any = null;
  
  operador = {
    RFC: "",
    NombrePersonal: "",
    ApPaterno: "",
    ApMaterno: "",
    Sexo: "",
    FechaNacimiento: "",
    CorreoElectronico: "",
    Password: "",
    Rol: "Operador",
    FechaCreacion: "",
    Direccion: {
      NumeroInterior: "",
      NumeroExterior: "",
      Calle: "",
      Colonia: "",
      Ciudad: "",
    },
    Telefono: [
      {
        Lada: "",
        Numero: "",
      },
    ],
    Estado: "",
    TokenVerificacion: "",
    EstadoVerificacion: "",
    FechaUltimaModificacion: "",
  };

  private searchSubject: Subject<string> = new Subject();

  constructor(private operadorService: OperadorService) {
    // Inyección del servicio
    this.getOperadores(); // Cargar los operadores al inicio
  }

  ngOnInit() {
    // Aplicamos debounce a la búsqueda
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.updateFilteredList();
      });
  }

  // Obtener todos los operadores desde el back-end
  getOperadores() {
    this.operadorService.getOperadores().subscribe(
      (response) => {
        // Verificar si la respuesta contiene el campo 'data' y es un arreglo
        if (Array.isArray(response.data)) {
          this.operadores = response.data;
        } else {
          console.error("Datos inválidos recibidos", response);
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
              <h2 class="swal-title">ERROR</h2>
              <p class="swal-text">${response}</p>`,
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
            }
          `;
          document.head.appendChild(style);
        }
        this.updateFilteredList();
      },
      (error) => {
        console.error("Error al obtener operadores:", error);
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
            <h2 class="swal-title">ERROR</h2>
            <p class="swal-text">${error}</p>`,
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
          }
        `;
        document.head.appendChild(style);
      }
    );
  }

  // Abrir el modal
  openModal() {
    this.isModalOpen = true;
    this.isEditing = false; // Asegura que estamos en el modo de agregar
    this.resetForm();
  }

  // Cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para manejar la edición de un operador
  editOperador(operador: any) {
    this.operador = { ...operador };
    this.isEditing = true;
    this.isModalOpen = true;
    this.editingIndex = this.operadores.findIndex(
      (o) => o.RFC === operador.RFC
    );
  }

  // Método para alternar entre mostrar y ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Método para agregar o modificar un operador
  onSubmit() {
    const operadorData = {
      CorreoElectronico: this.operador.CorreoElectronico,
      Direccion: this.eliminarId(this.operador.Direccion),  // Eliminar _id de Direccion
      Telefono: this.operador.Telefono.map(t => this.eliminarId(t)),  // Eliminar _id de cada objeto en Telefono
      Estado: this.operador.Estado,
    };

    if (!this.validateForm()) return;

    console.log("Datos que se van a enviar:",operadorData); // Depurar los datos

    if (this.isEditing && this.editingIndex !== null) {
      // Actualizar operador
      this.operadorService.editarOperador(this.operador.RFC, operadorData).subscribe(
        (data) => {
          if (this.editingIndex !== null) {
            this.operadores[this.editingIndex] = { ...this.operador };
          }
          this.isEditing = true;
          this.editingIndex = null; // Asignamos null aquí
          this.closeModal();
          this.updateFilteredList();
        Swal.fire({
          html: `<div class="swal-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
              </svg>
            </div>
            <h2 class="swal-title">ÉXITO</h2>
            <p class="swal-text">Operador MODIFICADO correctamente</p>`,
          icon: "success",
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
        },
        (error) => {
          console.error("Error al actualizar el operador:", error);
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
              <h2 class="swal-title">ERROR</h2>
              <p class="swal-text">${error}</p>`,
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
            }
          `;
          document.head.appendChild(style);
        }
      );
    } else {
      // Crear un nuevo operador
      this.operadorService.registrar(this.operador).subscribe(
        (data) => {
          this.operadores.push({ ...this.operador });
          this.closeModal();
          this.updateFilteredList();
          Swal.fire({
            html: `<div class="swal-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                  <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                  <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                  <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                  <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
                </svg>
              </div>
              <h2 class="swal-title">ÉXITO</h2>
              <p class="swal-text">Operador CREADO correctamente</p>`,
            icon: "success",
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
        },
        (error) => {
          console.error("Error al registrar el operador:", error);
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
              <h2 class="swal-title">ERROR</h2>
              <p class="swal-text">${error}</p>`,
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
            }
          `;
          document.head.appendChild(style);        }
      );
      console.log("Datos que se van a enviar:", this.operador); // Depurar los datos
    }
    
  }
   // Función para eliminar el campo _id de un objeto
  private eliminarId(obj: any): any {
  const { _id, ...resto } = obj;  // Elimina el campo _id
  return resto;
}
  // Método para resetear el formulario
  resetForm() {
    this.operador = {
      RFC: "",
      NombrePersonal: "",
      ApPaterno: "",
      ApMaterno: "",
      Sexo: "",
      FechaNacimiento: "",
      CorreoElectronico: "",
      Password: "",
      Rol: "Operador",
      FechaCreacion: "",
      Direccion: {
        NumeroInterior: "",
        NumeroExterior: "",
        Calle: "",
        Colonia: "",
        Ciudad: "",
      },
      Telefono: [{ Lada: "", Numero: "" }],
      Estado: "",
      TokenVerificacion: "",
      EstadoVerificacion: "",
      FechaUltimaModificacion: "",
    };
  }

  // Actualizar lista filtrada
  updateFilteredList() {
    this.filteredOperadores = this.operadores.filter(
      (operador) =>
        operador.NombrePersonal.toLowerCase().includes(
          this.searchQuery.toLowerCase()
        ) ||
        operador.RFC.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        operador.CorreoElectronico.toLowerCase().includes(
          this.searchQuery.toLowerCase()
        )
    );
  }

  // Método de búsqueda
  search() {
    this.searchSubject.next(this.searchQuery);
  }

  // Método para cancelar la edición y limpiar el formulario
  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
    this.editingIndex = null;
  }

  advetenciaeliminado(operadorRFC: any) {
    Swal.fire({
      customClass: {
        popup: "custom-swal", // Clase personalizada para el modal
      },
      html: `
    <div class="swal-logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
        <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
        <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
        <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
        <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
      </svg>
    </div>
    <img src="advertencia.svg" width="80" height="80" style="margin-top:20px; margin-bottom:10px;" />
    <h2 class="swal-title">ADVERTENCIA</h2>
    <p class="swal-text">Esta Acción NO Puede Revertirse</p>
  `,
      width: 400, // Ancho fijo para el modal
      padding: "2rem",
      showCancelButton: true,
      confirmButtonColor: "#164474",
      cancelButtonColor: "#333333",
      confirmButtonText: "Eliminarlo",
      cancelButtonText: "Cancelar",
      buttonsStyling: true,
      reverseButtons: false, // Botón de cancelar a la izquierda
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteOperador(operadorRFC);
      }
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

  /* Mejorar proporción de los botones */
  .swal2-actions {
    margin-top: 0 !important;
    gap: 15px;
  }
  .swal2-confirm, .swal2-cancel {
    padding: 12px 24px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    border-radius: 4px !important;
    min-width: 120px !important;
  }
`;
    document.head.appendChild(style);
  }

  // Método para eliminar un operador
  deleteOperador(operadorToDelete: any) {
    this.operadorService.eliminarOperador(operadorToDelete.RFC).subscribe(
      () => {
        this.operadores = this.operadores.filter(
          (op) => op.RFC !== operadorToDelete.RFC
        );
        this.updateFilteredList();
        Swal.fire({
          html: `<div class="swal-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 70" width="120">
                <rect x="2" y="2" width="36" height="36" fill="none" stroke="#333" stroke-width="2"/>
                <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="1"/>
                <text x="20" y="28" font-family="Arial, sans-serif" font-weight="500" font-size="20" fill="#333" text-anchor="middle">M</text>
                <text x="48" y="30" font-family="Arial, sans-serif" font-weight="normal" font-size="16" fill="#999">MOVICASH</text>
              </svg>
            </div>
            <h2 class="swal-title">ÉXITO</h2>
            <p class="swal-text">Operador ELIMINADO correctamente</p>`,
          icon: "success",
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
      },
      (error) => {
        console.error("Error al eliminar operador:", error);
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
            <h2 class="swal-title">ERROR</h2>
            <p class="swal-text">${error}</p>`,
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
          }
        `;
        document.head.appendChild(style);      }
    );
  }

  // Método para agregar un número de teléfono
  addPhone() {
    this.operador.Telefono.push({ Lada: "", Numero: "" });
  }

  // Método para eliminar un número de teléfono
  removePhone(index: number) {
    if (this.operador.Telefono.length > 1) {
      this.operador.Telefono.splice(index, 1);
    }
  }

// Añade esta estructura al componente
errorMessages: { [key: string]: string } = {};

// Modifica tu método de validación
validateForm(): boolean {
  // Limpia todos los mensajes de error previos
  this.errorMessages = {};
  let isValid = true;

  // Validación de campos personales
  if (!this.operador.NombrePersonal) {
    this.errorMessages['NombrePersonal'] = 'El nombre es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.ApPaterno) {
    this.errorMessages['ApPaterno'] = 'El apellido paterno es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.Sexo) {
    this.errorMessages['Sexo'] = 'El sexo es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.FechaNacimiento) {
    this.errorMessages['FechaNacimiento'] = 'La fecha de nacimiento es obligatoria';
    isValid = false;
  } else {
    // Validación de la edad (mínimo 18 años)
    const fechaNacimiento = new Date(this.operador.FechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const cumpleEnEsteAño = hoy.setFullYear(hoy.getFullYear() - edad) >= fechaNacimiento.getTime();
    
    if (edad < 18 || (edad === 18 && !cumpleEnEsteAño)) {
      this.errorMessages['FechaNacimiento'] = 'Debes tener al menos 18 años de edad';
      isValid = false;
    }
  }
  
  if (!this.operador.CorreoElectronico) {
    this.errorMessages['CorreoElectronico'] = 'El correo electrónico es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.Password) {
    this.errorMessages['Password'] = 'La contraseña es obligatoria';
    isValid = false;
  } else {
    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.operador.Password)) {
      this.errorMessages['Password'] = 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número';
      isValid = false;
    }
  }
  
  // Validación de RFC solo en modo agregar
  if (!this.isEditing) {
    if (!this.operador.RFC) {
      this.errorMessages['RFC'] = 'El RFC es obligatorio';
      isValid = false;
    } else if (this.operador.RFC.length !== 13) {
      this.errorMessages['RFC'] = 'El RFC debe contener exactamente 13 caracteres';
      isValid = false;
    }
  }
  
  // Validación de los campos de dirección
  if (!this.operador.Direccion.Calle) {
    this.errorMessages['Calle'] = 'La calle es obligatoria';
    isValid = false;
  }
  
  if (!this.operador.Direccion.NumeroExterior) {
    this.errorMessages['NumeroExterior'] = 'El número exterior es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.Direccion.Colonia) {
    this.errorMessages['Colonia'] = 'La colonia es obligatoria';
    isValid = false;
  }
  
  if (!this.operador.Direccion.Ciudad) {
    this.errorMessages['Ciudad'] = 'La ciudad es obligatoria';
    isValid = false;
  }
  
  // Validación de los teléfonos
  this.operador.Telefono.forEach((tel, index) => {
    if (!tel.Lada) {
      this.errorMessages[`Lada${index}`] = 'La lada es obligatoria';
      isValid = false;
    }
    
    if (!tel.Numero) {
      this.errorMessages[`Telefono${index}`] = 'El número de teléfono es obligatorio';
      isValid = false;
    } else if (!/^\d{10}$/.test(tel.Numero)) {
      this.errorMessages[`Telefono${index}`] = 'El teléfono debe tener exactamente 10 dígitos numéricos';
      isValid = false;
    }
  });
  
  // Estado y Fecha de creación
  if (!this.operador.Estado) {
    this.errorMessages['Estado'] = 'El estado es obligatorio';
    isValid = false;
  }
  
  if (!this.operador.FechaCreacion) {
    this.errorMessages['FechaCreacion'] = 'La fecha de creación es obligatoria';
    isValid = false;
  }
  
  return isValid;
}

  openConfirmModal(operador: any) {
    this.operadorAEliminar = operador;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.operadorAEliminar = null;
  }

  
}
