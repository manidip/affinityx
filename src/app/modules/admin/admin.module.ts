import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { AdminRoutingModule } from './admin-routing.module';
import { NgSelect2Module } from 'ng-select2';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  AdminComponent,DashboardComponent,DocumentsComponent, 
  AddDocumentComponent,ViewDocumentComponent,
  ProductsComponent,ResourcesComponent,PartnersComponent,
  UsersComponent,AddUserComponent,AddPartnerComponent,AddResourceComponent,
  DashboardLayoutsComponent, AddDashboardLayoutsComponent
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
    AddUserComponent,
    AddPartnerComponent,
    AddResourceComponent,
    DashboardLayoutsComponent,
    AddDashboardLayoutsComponent,
  ],
  imports: [
    CommonModule,
    NgSelect2Module,
    ColorPickerModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { }
