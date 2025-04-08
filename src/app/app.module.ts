import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PantallaRecuperacionComponent } from './PANTALLAS_ADMIN/pantalla-recuperacion/pantalla-recuperacion.component';
import { PantallaVerificacionCodigoComponent } from './components/pantalla-verificacion-codigo/pantalla-verificacion-codigo.component';
import { PantallaLoginComponent } from './components/pantalla-login/pantalla-login.component';
import { PantallaAdminComponent } from './PANTALLAS_ADMIN/pantalla-admin/pantalla-admin.component';
import { PantallaBuenIntentoComponent } from './components/pantalla-buen-intento/pantalla-buen-intento.component';
import { AdvertenciaComponent } from './components/advertencia/advertencia.component';
import { PantallaGestionAdminComponent } from './PANTALLAS_ADMIN/pantalla-gestion-admin/pantalla-gestion-admin.component';
import { PantallaOperadorDashboardComponent } from './PANTALLAS_OPERADOR/pantalla-operador-dashboard/pantalla-operador-dashboard.component';
import { PantallaAprobacionRechazoComponent } from './PANTALLAS_OPERADOR/pantalla-aprobacion-rechazo/pantalla-aprobacion-rechazo.component';
import { AltaOrdenanteComponent } from './PANTALLAS_OPERADOR/alta-ordenante/alta-ordenante.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { GestionOrdenantesComponent } from './PANTALLAS_OPERADOR/gestion-ordenantes/gestion-ordenantes.component';
import { PantallaBitacoraComponent } from './PANTALLAS_ADMIN/pantalla-bitacora/pantalla-bitacora.component';
import { DepositoCuentaComponent } from './PANTALLAS_OPERADOR/deposito-cuenta/deposito-cuenta.component';
import { PantallaGestionOperadorComponent } from './PANTALLAS_ADMIN/pantalla-gestion-operador/pantalla-gestion-operador.component';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PantallaSolicitudComponent } from './PANTALLAS_OPERADOR/pantalla-solicitud/pantalla-solicitud.component';
import { CommonModule } from '@angular/common';
import { PantallaBitacoraInicioCierreComponent } from './PANTALLAS_ADMIN/pantalla-bitacora-inicio-cierre/pantalla-bitacora-inicio-cierre.component';
import { RegistrarSolicitudComponent } from './empresas/page/registrar-solicitud/registrar-solicitud.component';

@NgModule({
  declarations: [
    AppComponent,
    PantallaRecuperacionComponent,
    PantallaVerificacionCodigoComponent,
    PantallaLoginComponent,
    PantallaAdminComponent,
    PantallaBuenIntentoComponent,
    AdvertenciaComponent,
    PantallaGestionAdminComponent,
    PantallaOperadorDashboardComponent,
    PantallaAprobacionRechazoComponent,
    AltaOrdenanteComponent,
    CambiarContrasenaComponent,
    GestionOrdenantesComponent,
    PantallaBitacoraComponent,
    DepositoCuentaComponent,
    PantallaGestionOperadorComponent,
    PantallaSolicitudComponent,
    PantallaBitacoraInicioCierreComponent,
    RegistrarSolicitudComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule ,
    MatCardModule ,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule, 
    MatFormFieldModule,
    MatTableModule,
    CommonModule,
    


  ],
  providers: [
    provideHttpClient(withFetch()),
    MatDatepickerModule
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Opcional, si hay problemas con elementos desconocidos
})
export class AppModule { }