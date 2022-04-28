import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';

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
    ColorPickerModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule {
  constructor(){
    console.log("AdminModule");
  }
 }
