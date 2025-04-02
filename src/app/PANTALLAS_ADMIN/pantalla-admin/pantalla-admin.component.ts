import { Component } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Importación correcta
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-pantalla-admin',
  templateUrl: './pantalla-admin.component.html',
  styleUrls: ['./pantalla-admin.component.css'] 
})
export class PantallaAdminComponent {
  nombreUsuario: string = '[NOMBRE USER]';
  constructor(private router: Router, private authService: AuthService) { 
    
 
  
  }
  ngOnInit(): void {
    this.cargarNombreUsuario();
  }
  cargarNombreUsuario(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        
        this.nombreUsuario = decodedToken.NombrePersonal || 
                            decodedToken.nombrePersonal || 
                            decodedToken.nombre ||
                            decodedToken.name ||
                            this.authService.getUserName() || '';
        
        if (!this.nombreUsuario) {
          const correo = localStorage.getItem('userEmail');
          if (correo) {
            this.nombreUsuario = correo.split('@')[0];
          }
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
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
