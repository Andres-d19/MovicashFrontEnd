import { Component, OnInit } from '@angular/core';
import { OrdenanteService } from '../../services/OPERADORES/ordenante.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-ordenantes',
  templateUrl: './gestion-ordenantes.component.html',
  styleUrls: ['./gestion-ordenantes.component.css']
})
export class GestionOrdenantesComponent implements OnInit {
  ordenantes: any[] = [];
  ordenantesFiltrados: any[] = [];
  searchText: string = '';
  ordenanteSeleccionado: any = null;

  constructor(private ordenanteService: OrdenanteService, private router: Router) {}

  ngOnInit() {
    this.obtenerOrdenantes();
  }

  obtenerOrdenantes() {
    this.ordenanteService.obtenerOrdenantes().subscribe(
      data => {
        this.ordenantes = data;
        this.ordenantesFiltrados = [...data];
      },
      error => {
        console.error('Error al obtener los ordenantes:', error);
      }
    );
  }

  // Selecciona un ordenante dependiendo de la acción (modificar o eliminar)
  seleccionarOrdenante(ordenante: any, accion: string) {
    if (accion === 'modificar') {
      this.ordenanteSeleccionado = { 
        ...ordenante,
        Telefono: ordenante.Telefono ? ordenante.Telefono : [''],
        Domicilio: ordenante.Direccion ? `${ordenante.Direccion.Calle}, ${ordenante.Direccion.NumeroExterior}, ${ordenante.Direccion.Colonia}, ${ordenante.Direccion.Ciudad}` : ''
      };
      document.body.classList.add('modal-open');
    } else if (accion === 'eliminar') {
      this.advertenciaEliminado(ordenante); // ⚠️ Ya NO asignamos this.ordenanteSeleccionado aquí
    }
  }
  


  // Cierra el modal de modificación
  cerrarModal() {
    this.ordenanteSeleccionado = null;
    document.body.classList.remove('modal-open');
  }

  // Función para mostrar la advertencia antes de eliminar
  advertenciaEliminado(ordenante: any) {
    this.ordenanteSeleccionado = null; // 🔴 Asegura que no se muestre el modal
    document.body.classList.remove('modal-open'); // 🔴 Cierra cualquier modal abierto
    
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
    if (result.isConfirmed) { // Si el usuario confirma, eliminar el ordenante
      this.eliminarOrdenante(ordenante);
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
  
  // Elimina el ordenante seleccionado
  eliminarOrdenante(ordenante: any) {
    if (!ordenante || !ordenante.RFCOrdenante) {
      Swal.fire("Error", "No se pudo eliminar el ordenante. Datos incompletos.", "error");////////////////////////////////////////////////////////////
      return;
    }
  
    this.ordenanteService.eliminarOrdenante(ordenante.RFCOrdenante).subscribe(
      () => {
        this.obtenerOrdenantes();
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
            <p class="swal-text">Ordenante ELIMINADO correctamente</p>
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

        
      },
      error => {
        Swal.fire("Error", "No se pudo eliminar el ordenante", "error");/////////////////////////////////////////////////////////////
      }
    );
  }
  
  

  // Modifica el ordenante seleccionado
  modificarOrdenante() {
    if (this.ordenanteSeleccionado && this.ordenanteSeleccionado.RFCOrdenante) {
      // Asegura que el teléfono esté bien manejado
      if (!Array.isArray(this.ordenanteSeleccionado.Telefono)) {
        this.ordenanteSeleccionado.Telefono = [this.ordenanteSeleccionado.Telefono];
      }

      this.ordenanteSeleccionado.FechaActualizacion = new Date().toISOString();

      this.ordenanteService.actualizarOrdenante(this.ordenanteSeleccionado.RFCOrdenante, this.ordenanteSeleccionado)
        .subscribe(
          () => {
            this.obtenerOrdenantes();
            this.cerrarModal(); // Cierra el modal después de modificar
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
                <p class="swal-text">Ordenante ACTUALIZADO correctamente</p>
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
    
          },
          error => console.error('Error al actualizar el ordenante:', error)////////////////////////////////////////////////////////////////////
        );
    }
  }

  // Función para buscar un ordenante por texto
  buscarOrdenante() {
    const texto = this.searchText.trim().toLowerCase();
    this.ordenantesFiltrados = this.ordenantes.filter(ordenante => 
      ordenante.NombreOrdenante.toLowerCase().includes(texto) ||
      ordenante.ApPaterno.toLowerCase().includes(texto) ||
      ordenante.ApMaterno.toLowerCase().includes(texto) ||
      ordenante.RFCOrdenante.toLowerCase().includes(texto)
    );
  }
}
