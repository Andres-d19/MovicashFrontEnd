import { Component } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Importación correcta
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pantalla-admin',
  templateUrl: './pantalla-admin.component.html',
  styleUrls: ['./pantalla-admin.component.css'] 
})
export class PantallaAdminComponent {
  nombreUsuario: string = 'Usuario';
  constructor(private router: Router, private authService: AuthService) { 
    
 
  
  }
  ngOnInit(): void {
    this.cargarNombreUsuario();
  }

  cargarNombreUsuario(): void {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    this.authService.getUserName().subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        
        if (response && response.nombreUsuario) {
          // La respuesta contiene un array de objetos
          if (Array.isArray(response.nombreUsuario) && response.nombreUsuario.length > 0) {
            const primerUsuario = response.nombreUsuario[0];
            
            // Extraer el NombrePersonal del primer elemento del array
            if (primerUsuario && primerUsuario.NombrePersonal) {
              this.nombreUsuario = primerUsuario.NombrePersonal;
            } else {
              this.nombreUsuario = 'Usuario';
            }
          } else {
            this.nombreUsuario = 'Usuario';
          }
        } else {
          this.nombreUsuario = 'Usuario';
        }
        
        console.log('Nombre de usuario establecido:', this.nombreUsuario);
      },
      (error) => {
        console.error('Error al obtener el nombre del usuario:', error);
        this.nombreUsuario = 'Usuario';
      }
    );
  }
  
 

  logout(): void {
    localStorage.removeItem('token');
    
    this.authService.logout();
    
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('estado');
    
    this.router.navigate(['/']);
  }

}
