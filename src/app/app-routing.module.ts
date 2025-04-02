import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PantallaLoginComponent } from './components/pantalla-login/pantalla-login.component';
import { PantallaRecuperacionComponent } from './PANTALLAS_ADMIN/pantalla-recuperacion/pantalla-recuperacion.component';
import { PantallaVerificacionCodigoComponent } from './components/pantalla-verificacion-codigo/pantalla-verificacion-codigo.component';
import { AuthGuard } from './auth.guard';
import { PantallaAdminComponent } from './PANTALLAS_ADMIN/pantalla-admin/pantalla-admin.component';
import { PantallaBuenIntentoComponent } from './components/pantalla-buen-intento/pantalla-buen-intento.component';
import { PantallaGestionAdminComponent } from './PANTALLAS_ADMIN/pantalla-gestion-admin/pantalla-gestion-admin.component';
import { PantallaOperadorDashboardComponent } from './PANTALLAS_OPERADOR/pantalla-operador-dashboard/pantalla-operador-dashboard.component';
import { PantallaAprobacionRechazoComponent } from './PANTALLAS_OPERADOR/pantalla-aprobacion-rechazo/pantalla-aprobacion-rechazo.component';

import { AltaOrdenanteComponent } from './PANTALLAS_OPERADOR/alta-ordenante/alta-ordenante.component';

import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { GestionOrdenantesComponent } from './PANTALLAS_OPERADOR/gestion-ordenantes/gestion-ordenantes.component';
import { PantallaBitacoraComponent } from './PANTALLAS_ADMIN/pantalla-bitacora/pantalla-bitacora.component';
import { DepositoCuentaComponent } from './PANTALLAS_OPERADOR/deposito-cuenta/deposito-cuenta.component';
import { PantallaGestionOperadorComponent } from './PANTALLAS_ADMIN/pantalla-gestion-operador/pantalla-gestion-operador.component';
import { PantallaSolicitudComponent } from './PANTALLAS_OPERADOR/pantalla-solicitud/pantalla-solicitud.component';
import { PantallaBitacoraInicioCierreComponent } from './PANTALLAS_ADMIN/pantalla-bitacora-inicio-cierre/pantalla-bitacora-inicio-cierre.component';


const routes: Routes = [
  //RUTAS EXTRAS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  { path: '', redirectTo: '/pantalla-login', pathMatch: 'full' },
    { path: 'pantalla-login', component: PantallaLoginComponent },
    { path: 'pantalla-buen-intento', component: PantallaBuenIntentoComponent }, 
    { path: 'pantalla-verificacion-codigo', component: PantallaVerificacionCodigoComponent }, 

  // RUTAS ADMINISTRADOR  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    {
      path: 'pantalla-adminDashboard', 
      component: PantallaAdminComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' } 
    },
    {
      path: 'pantalla-gestionAdmin', 
      component: PantallaGestionAdminComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' } 

    },
    {
      path: 'pantalla-bitacora-Usuarios', 
      component: PantallaBitacoraComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' } 

    },
    {
      path: 'pantalla-recuperacion-contraseña', 
      component: PantallaRecuperacionComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' } 
    },
    {
      path: 'cambiar-password', 
      component: CambiarContrasenaComponent, 
      canActivate: [AuthGuard], 
      data: { role: ['Admin', 'Operador'] }  
    },
    {
      path: 'pantalla-gestion-operador', 
      component: PantallaGestionOperadorComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' }  
    },
    {
      path: 'pantalla-bitacora-inicio-cierre-secion', 
      component: PantallaBitacoraInicioCierreComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Admin' }  
    },
     
   
  
    
    // RUTAS OPERADORES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    {
      path: 'pantalla-solicitud-transaccion', 
      component: PantallaSolicitudComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Operador' } 
    },
 


    {
      path: 'pantalla-OperadorDashboard', 
      component: PantallaOperadorDashboardComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Operador' } 
    },
   
    
    {
      path: 'pantalla-aprobacion-rechazo', 
      component: PantallaAprobacionRechazoComponent, 
      canActivate: [AuthGuard], 
      data: { role: 'Operador' } 

    },

  

    
    { path: 'creacion-ordenante', 
      component: AltaOrdenanteComponent,
      canActivate: [AuthGuard], 
      data: { role: 'Operador' }  
    }, 

    { path: 'gestion-ordenante', 
      component: GestionOrdenantesComponent,
      canActivate: [AuthGuard], 
      data: { role: 'Operador' }  
    }, 
    { path: 'pantalla-deposito-cuenta', 
      component: DepositoCuentaComponent,
      canActivate: [AuthGuard], 
      data: { role: 'Operador' }  
    }, 
    
    

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
