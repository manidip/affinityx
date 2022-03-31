import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UsersFrontendComponent } from './pages/users-frontend.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserDocumentsComponent } from './pages/user-documents/user-documents.component';
import { NgSelect2Module } from 'ng-select2';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserDashboardComponent,
    UsersFrontendComponent,
    UserDocumentsComponent,
  ],
  imports: [
    CommonModule,
    NgSelect2Module,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
