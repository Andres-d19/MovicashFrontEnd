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
            Swal.fire('Éxito', 'Administrador actualizado correctamente', 'success');
          },
          (error) => {
            console.error('Error al actualizar administrador:', error);
            Swal.fire('Error', 'No se pudo actualizar el administrador', 'error');
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
        Swal.fire('Error', this.errorMessage, 'error');
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
        Swal.fire('Error', this.errorMessage, 'error');
        isValid = false;
      }
    });

    // Validar si el Nombre Personal está vacío
  if (!this.admin.NombrePersonal) {
    this.errorMessage = 'El nombre personal es obligatorio.';
    Swal.fire('Error', this.errorMessage, 'error');
    isValid = false;
  }

  if (!this.admin.ApPaterno) {
    this.errorMessage = 'El apellido paterno es obligatorio.';
    Swal.fire('Error', this.errorMessage, 'error');
    isValid = false;
  }

  if (!this.admin.ApMaterno) {
    this.errorMessage = 'El apellido materno es obligatorio.';
    Swal.fire('Error', this.errorMessage, 'error');
    isValid = false;
  }

  // Validar si el Correo Electrónico está vacío o es inválido
  if (!this.admin.CorreoElectronico || !/\S+@\S+\.\S+/.test(this.admin.CorreoElectronico)) {
    this.errorMessage = 'El correo electrónico debe ser válido.';
    Swal.fire('Error', this.errorMessage, 'error');
    isValid = false;
  }

    return isValid;
  }
    
  alertaEliminar(admin:any){
  Swal.fire({
    title: 'ADVERTENCIA',
    text: 'Esta accion no puede revertirce',
    imageUrl: 'advertencia.svg',
    imageWidth: 80,  //Ancho
    imageHeight: 80, // Alto
    showCancelButton: true,
    confirmButtonColor: '#000000',
    cancelButtonColor: '#164474',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteAdmin(admin)
    }
  });
}

  deleteAdmin(admin: any) {
    if (!admin.RFC) {
      console.error('Error: No se proporcionó un RFC válido.');
      return;
    }
  
    this.adminService.deleteAdmin(admin.RFC).subscribe(
      () => {
        console.log(`Administrador ${admin.NombrePersonal} eliminado correctamente.`);
        Swal.fire({
          title: '¡Eliminación Exitosa!',
          text: `El administrador ${admin.NombrePersonal} ${admin.ApPaterno} (${admin.RFC}) ha sido eliminado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#000000',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.loadAdmins(); // Recargar la lista después de confirmar
        });
      },
      (error) => {
        console.error(`Error al eliminar administrador ${admin.NombrePersonal}:`, error);
        Swal.fire('Error', 'No se pudo eliminar el administrador', 'error');
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
        Swal.fire('Éxito', 'Administrador registrado correctamente', 'success'); 
      },
      (error: any) => {  
        console.error('Error al registrar administrador:', error);
        this.errorMessage = 'Hubo un error al registrar al administrador. Por favor, inténtelo de nuevo. Posible error el RFC o Correo Electronico';
        Swal.fire('Error', this.errorMessage, 'error');
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
