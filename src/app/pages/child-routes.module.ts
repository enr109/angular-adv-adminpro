import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesaComponent } from './promesa/promesa.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const childRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dashboard'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajuste de cuenta'}  },
      { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas'}  },
      { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar'}  },
      { path: 'graficas1', component: Grafica1Component, data: { titulo: 'Grafica #1'}  },
      { path: 'promesa', component: PromesaComponent , data: { titulo: 'Promesas'} },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
      { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario'} },
      
      //Manteniemientos
      { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales'} },
      { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Medicos'} },
      { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de Medicos'} },
      
      // Rutas de Admin
      { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuario'} },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [ RouterModule]
})
export class ChildRoutesModule { }
