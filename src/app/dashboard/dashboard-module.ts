import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Layout } from './layout/layout';
import { Sidebar } from './sidebar/sidebar';
import { DashboardHome } from './dashboard-home/dashboard-home';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    Layout,
    Sidebar,
    DashboardHome,
  ]
})
export class DashboardModule { }
