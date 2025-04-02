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
          alert("Error: Los datos recibidos no son válidos.");
        }
        this.updateFilteredList();
      },
      (error) => {
        console.error("Error al obtener operadores:", error);
        alert("Error al cargar los operadores.");
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
    if (!this.validateForm()) return;

    console.log("Datos que se van a enviar:", this.operador); // Depurar los datos

    if (this.isEditing && this.editingIndex !== null) {
      // Actualizar operador
      this.operadorService.editarOperador(this.operador).subscribe(
        (data) => {
          if (this.editingIndex !== null) {
            this.operadores[this.editingIndex] = { ...this.operador };
          }
          this.isEditing = false;
          this.editingIndex = null; // Asignamos null aquí
          this.updateFilteredList();
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
              <p class="swal-text">Ordenante modificado correctamente</p>
            `,
            icon: "success",
            customClass: {
              popup: "custom-swal",
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
    }`;
          document.head.appendChild(style);
        },
        (error) => {
          console.error("Error al actualizar el operador:", error);
          alert("Error al actualizar el operador: " + error.message); // Muestra el mensaje de error más detallado
        }
      );
    } else {
      // Crear un nuevo operador
      this.operador.FechaCreacion = this.today;
      this.operadorService.registrar(this.operador).subscribe(
        (data) => {
          this.operadores.push({ ...this.operador });
          this.closeModal();
          this.updateFilteredList();
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
              <p class="swal-text">Ordenante modificado correctamente</p>
            `,
            icon: "success",
            customClass: {
              popup: "custom-swal",
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
    }`;
          document.head.appendChild(style);
        },
        (error) => {
          console.error("Error al registrar el operador:", error);
          alert("Error al registrar el operador: " + error.message); // Muestra el mensaje de error más detallado
        }
      );
      console.log("Datos que se van a enviar:", this.operador); // Depurar los datos
    }
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
            <p class="swal-text">Ordenante modificado correctamente</p>
          `,
          icon: "success",
          customClass: {
            popup: "custom-swal",
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
  }`;
        document.head.appendChild(style);
      },
      (error) => {
        console.error("Error al eliminar operador:", error);
        alert("Error al eliminar el operador: " + error.message);
      }
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

  // Método para validar los datos del formulario antes de guardar
  validateForm(): boolean {
    this.errorMessage = "";

    const requiredFields: (keyof typeof this.operador)[] = [
      "NombrePersonal",
      "ApPaterno",
      "Sexo",
      "FechaNacimiento",
      "CorreoElectronico",
      "Password",
      "FechaCreacion",
      "Estado",
    ];

    // Validación de los campos obligatorios
    for (let field of requiredFields) {
      if (!this.operador[field]) {
        this.errorMessage = `El campo ${field} no puede estar vacío.`;
        alert(this.errorMessage);
        return false;
      }
    }

    const requiredAddressFields: (keyof typeof this.operador.Direccion)[] = [
      "NumeroExterior",
      "Calle",
      "Colonia",
      "Ciudad",
    ];

    // Validación de los campos de la dirección
    for (let field of requiredAddressFields) {
      if (!this.operador.Direccion[field]) {
        this.errorMessage = `El campo ${field} de la dirección no puede estar vacío.`;
        alert(this.errorMessage);
        return false;
      }
    }

    // Solo validamos RFC en modo agregar, no en editar
    if (!this.isEditing && this.operador.RFC.length !== 13) {
      this.errorMessage = "El RFC debe contener exactamente 13 caracteres.";
      alert(this.errorMessage);
      return false;
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.operador.Password)) {
      this.errorMessage =
        "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.";
      alert(this.errorMessage);
      return false;
    }

    // Validación de los teléfonos
    for (let tel of this.operador.Telefono) {
      if (!/^\d{10}$/.test(tel.Numero)) {
        this.errorMessage =
          "Cada número de teléfono debe tener exactamente 10 dígitos y no contener letras.";
        alert(this.errorMessage);
        return false;
      }
    }

    // Validación de la edad (mínimo 18 años)
    const fechaNacimiento = new Date(this.operador.FechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const cumpleEnEsteAño =
      hoy.setFullYear(hoy.getFullYear() - edad) >= fechaNacimiento.getTime();
    if (edad < 18 || (edad === 18 && !cumpleEnEsteAño)) {
      this.errorMessage = "Debes tener al menos 18 años de edad.";
      alert(this.errorMessage);
      return false;
    }
    return true;
  }

  openConfirmModal(operador: any) {
    this.operadorAEliminar = operador;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.operadorAEliminar = null;
  }

  confirmDelete() {
    if (!this.operadorAEliminar) return;

    this.operadorService.eliminarOperador(this.operadorAEliminar.RFC).subscribe(
      () => {
        this.operadores = this.operadores.filter(
          (op) => op.RFC !== this.operadorAEliminar.RFC
        );
        this.updateFilteredList();
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
            <p class="swal-text">Ordenante modificado correctamente</p>
          `,
          icon: "success",
          customClass: {
            popup: "custom-swal",
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
    min-width: 120px !important;
  }`;
        document.head.appendChild(style);
        this.closeConfirmModal();
      },
      (error) => {
        console.error("Error al eliminar operador:", error);
        alert("Error al eliminar el operador: " + error.message);
      }
    );
  }
}
