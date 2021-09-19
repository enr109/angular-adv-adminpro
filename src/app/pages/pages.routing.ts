import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesaComponent } from './promesa/promesa.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';



const routes: Routes = [
    
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
          { path: '', component: DashboardComponent, data: { titulo: 'Dashboard'} },
          { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar'}  },
          { path: 'graficas1', component: Grafica1Component, data: { titulo: 'Grafica #1'}  },
          { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajuste de cuenta'}  },
          { path: 'promesa', component: PromesaComponent , data: { titulo: 'Promesas'} },
          { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
          { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario'} },

          //Manteniemientos
          { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuario de aplicasion'} },
          
        ]
    },
    

    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
