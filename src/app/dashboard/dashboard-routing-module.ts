import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { DashboardHome } from './dashboard-home/dashboard-home';
import { AdminUsers } from './admin-users/admin-users';
import { authGuard } from '../core/guards/auth';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHome },
      { path: 'calculadora', component: DashboardHome }, // Placeholder
      { path: 'proyectos', component: DashboardHome }, // Placeholder
      { path: 'rubros', component: DashboardHome }, // Placeholder
      { path: 'reportes', component: DashboardHome }, // Placeholder
      { path: 'equipo', component: DashboardHome }, // Placeholder
      { path: 'permisos', component: DashboardHome }, // Placeholder
      { path: 'configuracion', component: DashboardHome }, // Placeholder
      { path: 'admin-usuarios', component: AdminUsers },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
