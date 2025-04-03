import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Admin, BitacoraService } from '../../services/ADMINISTRADOR/bitacoraUsuarios';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pantalla-bitacora',
  templateUrl: './pantalla-bitacora.component.html',
  styleUrls: ['./pantalla-bitacora.component.css']
})
export class PantallaBitacoraComponent implements OnInit {
  displayedColumns: string[] = ['rfc', 'nombrePersonal', 'apPaterno', 'apMaterno', 'sexo', 'correo', 'rol', 'fechaCreacion'];
  dataSource = new MatTableDataSource<Admin>([]);
  usuarios: Admin[] = [];
  isLoading = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor (
    private router: Router,
    private bitacora: BitacoraService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.dataSource.sort = this.sort;
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.bitacora.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.usuarios.length > 0) {
      const usuariosFiltrados = this.bitacora.filtrarUsuariosLocal(this.usuarios, filterValue);
      this.dataSource.data = usuariosFiltrados;
    }
  }

  showError(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  goBack() {
    this.router.navigate(['pantalla-adminDashboard']);
  }
}