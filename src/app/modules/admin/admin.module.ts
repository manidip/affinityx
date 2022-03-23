import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NgSelect2Module } from 'ng-select2';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  AdminComponent,DashboardComponent,DocumentsComponent, 
  AddDocumentComponent,ViewDocumentComponent,
  ProductsComponent,ResourcesComponent,PartnersComponent,
  UsersComponent
} from './pages';

@NgModule({
  declarations: [
    DashboardComponent,
    DocumentsComponent,
    AdminComponent,
    AddDocumentComponent,
    ViewDocumentComponent,
    UsersComponent,
    PartnersComponent,
    ResourcesComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    NgSelect2Module,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { }
