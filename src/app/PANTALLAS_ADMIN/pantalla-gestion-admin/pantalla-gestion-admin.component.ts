import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/ADMINISTRADOR/admin.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-gestion-admin',
  templateUrl: './pantalla-gestion-admin.component.html',
  styleUrls: ['./pantalla-gestion-admin.component.css']
})
export class PantallaGestionAdminComponent implements OnInit {
  isModalOpen: boolean = false;  
  isEditModal: boolean = false;
  searchQuery: string = '';
  admins: any[] = [];
  filteredAdmins: any[] = [];
  errorMessage: string = '';

  admin = {
    RFC: '',
    NombrePersonal: '',
    ApPaterno: '',
    ApMaterno: '',
    Sexo: '',
    FechaNacimiento: '',
    CorreoElectronico: '',
    Rol: 'Admin', 
    FechaCreacion: '',  
    Estado: '',
    Direccion: {
      NumeroInterior: '',
      NumeroExterior: '',
      Calle: '',
      Colonia: '',
      Ciudad: ''
    },
    Telefono: [{ Lada: '', Numero: '' }]  
  };

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins() {
    this.adminService.getAllAdmins().subscribe(
      (data) => {
        if (data && Array.isArray(data.data)) {
          this.admins = data.data;  // Aquí accedemos a la propiedad `data`
          this.updateFilteredList(); // Aseguramos que filteredAdmins se actualice con los administradores cargados
        } else {
          console.error('Datos inválidos recibidos para admins:', data);
          this.admins = [];
          this.filteredAdmins = [];
        }
      },
      (error) => {
        console.error('Error al cargar administradores', error);
        this.admins = [];
        this.filteredAdmins = [];
      }
    );
  }

  onSubmit(form: NgForm) {
    // Validaciones manuales antes de enviar
    if (!this.validateForm()) {
      return;
    }

    if (this.admin.RFC) {
      if (this.isEditModal) {
        this.adminService.updateAdmin(this.admin.RFC, this.admin).subscribe(
          () => {
            this.loadAdmins();
            this.closeModal();
            this.resetForm();
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
                <p class="swal-text">Administrador modificado correctamente</p>`,
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
            console.error('Error al actualizar administrador:', error);
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
                <p class="swal-text">No se pudo actualizar el administrador</p>`,
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
          }
        );
      } else {
        this.registerAdmin();
      }
    }
  }

  validateForm(): boolean {
    let isValid = true;

    // Validar Fecha de Nacimiento (mayor de 18 años)
    if (this.admin.FechaNacimiento) {
      const birthDate = new Date(this.admin.FechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        this.errorMessage = 'Debe ser mayor de 18 años';
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
            <p class="swal-text">El administrador debe ser mayor de 18 años.</p>`,
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
        isValid = false;
      }
    }

    // Validar Teléfono (7 o 10 dígitos)
    this.admin.Telefono.forEach(tel => {
      if (tel.Numero && !/^\d{7}$|^\d{10}$/.test(tel.Numero)) {
        this.errorMessage = 'El teléfono debe tener 7 o 10 números';
        Swal.fire('Error', this.errorMessage, 'error');
        isValid = false;
      }
      if (tel.Lada && !/^\d{2}$/.test(tel.Lada)) {
        this.errorMessage = 'La lada debe tener exactamente 2 dígitos';
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
            <p class="swal-text">La lada debe de tener 2 digitos.</p>`,
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
        isValid = false;
      }
    });

    // Validar si el Nombre Personal está vacío
  if (!this.admin.NombrePersonal) {
    this.errorMessage = 'El nombre personal es obligatorio.';
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
        <p class="swal-text">El nombre personal es obligatorio.</p>`,
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
    isValid = false;
  }

  if (!this.admin.ApPaterno) {
    this.errorMessage = 'El apellido paterno es obligatorio.';
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
        <p class="swal-text">El apellido paterno es obligatorio.</p>`,
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
    isValid = false;
  }

  if (!this.admin.ApMaterno) {
    this.errorMessage = 'El apellido materno es obligatorio.';
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
        <p class="swal-text">El apelldo materno es obligatorio.</p>`,
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
    isValid = false;
  }

  // Validar si el Correo Electrónico está vacío o es inválido
  if (!this.admin.CorreoElectronico || !/\S+@\S+\.\S+/.test(this.admin.CorreoElectronico)) {
    this.errorMessage = 'El correo electrónico debe ser válido.';
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
        <p class="swal-text">El correo electronico no es valido o ya esta registrado.</p>`,
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
    isValid = false;
  }

    return isValid;
  }
    
  advetenciaeliminado(admin: any) {
    Swal.fire({
   customClass: {
     popup: "custom-swal", 
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
   confirmButtonColor: "#000000",
   cancelButtonColor: "#164474",
   confirmButtonText: "Eliminarlo",
   cancelButtonText: "Cancelar",
   buttonsStyling: true,
   reverseButtons: false, // Botón de cancelar a la izquierda
 }).then((result) => {
   if (result.isConfirmed) {
     this.deleteAdmin(admin);
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

  deleteAdmin(admin: any) {
    if (!admin.RFC) {
      console.error('Error: No se proporcionó un RFC válido.');
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
          <p class="swal-text">El administrador no pudo ser borrado.</p>`,
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
      return;
    }
  
    this.adminService.deleteAdmin(admin.RFC).subscribe(
      () => {
        console.log(`Administrador ${admin.NombrePersonal} eliminado correctamente.`);
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
            <p class="swal-text">Administrador eliminado correctamente</p>`,
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
  setTimeout(() => {
    this.loadAdmins(); // Recargar la lista después de confirmar
  }, 0);
},
      (error) => {
        console.error(`Error al eliminar administrador ${admin.NombrePersonal}:`, error);
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
            <p class="swal-text">No se pudo eliminar al administrador</p>`,
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
      }
    );
  }

  

  // Actualizamos el método registerAdmin para usar AuthService
  registerAdmin() {
    this.admin.FechaCreacion = new Date().toISOString().split('T')[0];  
    this.authService.addAdmin(this.admin).subscribe(
      (response: any) => {  
        console.log('Administrador registrado con éxito:', response);
        this.loadAdmins();  
        this.closeModal();  
        this.resetForm(); 
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
            <p class="swal-text">Administrador registrado correctamente</p>`,
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
  setTimeout(() => {
    this.loadAdmins(); // Recargar la lista después de confirmar
  }, 0);
},
(error: any) => {  
  console.error('Error al registrar administrador:', error);
  this.errorMessage = 'Hubo un error al registrar al administrador. Por favor, inténtelo de nuevo. Posible error el RFC o Correo Electronico';
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
      <p class="swal-text">Hubo un error al registrar al administrador. Por favor, inténtelo de nuevo. Posible error el RFC o Correo Electronico.</p>`,
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
}
);
}
      

  // Método para abrir el modal de agregar
  openAddModal() {
    this.isEditModal = false;
    this.resetForm();  
    this.isModalOpen = true;  
  }

  // Método para abrir el modal de editar
  openEditModal(adminData: any) {
    this.isEditModal = true;
    this.admin = {
      RFC: adminData.RFC || '',
      NombrePersonal: adminData.NombrePersonal || '',
      ApPaterno: adminData.ApPaterno || '',
      ApMaterno: adminData.ApMaterno || '',
      Sexo: adminData.Sexo || '',
      FechaNacimiento: adminData.FechaNacimiento || '',
      CorreoElectronico: adminData.CorreoElectronico || '',
      Rol: adminData.Rol || 'Admin',
      FechaCreacion: adminData.FechaCreacion || '',
      Estado: adminData.Estado || '',
      Direccion: {
        NumeroInterior: adminData.Direccion?.NumeroInterior || '',
        NumeroExterior: adminData.Direccion?.NumeroExterior || '',
        Calle: adminData.Direccion?.Calle || '',
        Colonia: adminData.Direccion?.Colonia || '',
        Ciudad: adminData.Direccion?.Ciudad || ''
      },
      Telefono: adminData.Telefono && adminData.Telefono.length > 0
        ? adminData.Telefono
        : [{ Lada: '', Numero: '' }]
    };
    this.isModalOpen = false;
  }
  
  closeModal() {
    this.isModalOpen = false;  
    this.isEditModal = false;
    
  }

  resetForm() {
    this.admin = {
      RFC: '',
      NombrePersonal: '',
      ApPaterno: '',
      ApMaterno: '',
      Sexo: '',
      FechaNacimiento: '',
      CorreoElectronico: '',
      Rol:'Admin',
      FechaCreacion: '',
      Estado: '',
      Direccion: {
        NumeroInterior: '',
        NumeroExterior: '',
        Calle: '',
        Colonia: '',
        Ciudad: ''
      },
      Telefono: [{ Lada: '', Numero: ''}]
    };
  }

  search() {
    this.filteredAdmins = this.admins.filter(admin =>
      admin.NombrePersonal.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      admin.RFC.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  updateFilteredList() {
    if (Array.isArray(this.admins)) {
      this.filteredAdmins = [...this.admins];
    } else {
      console.error('this.admins no es un array válido:', this.admins);
      this.filteredAdmins = [];
    }
  }

  addPhoneNumber() {
    this.admin.Telefono.push({ Numero: '', Lada: '' });  
  }

  removePhoneNumber(index: number) {
    if (this.admin.Telefono.length > 1) {
      this.admin.Telefono.splice(index, 1);  // Eliminar un teléfono
    }
  }
}







