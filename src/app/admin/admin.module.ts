import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent,AdminDashboardComponent,UsersComponent,PartnersComponent,ResourcesComponent,ProductsComponent,DocumentsComponent } from './pages';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    UsersComponent,
    PartnersComponent,
    ResourcesComponent,
    ProductsComponent,
    DocumentsComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
