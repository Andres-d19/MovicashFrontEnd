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
  
  nombreUsuario: string = 'Usuario';

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