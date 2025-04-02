import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-operador-dashboard',
  templateUrl: './pantalla-operador-dashboard.component.html',
  styleUrl: './pantalla-operador-dashboard.component.css'
})
export class PantallaOperadorDashboardComponent implements OnInit {
  
  nombreUsuario: string = '[NOMBRE USER]';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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