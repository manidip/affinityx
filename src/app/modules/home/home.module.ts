import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home.component';
import { NgSelect2Module } from 'ng-select2';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddDocumentComponent } from './pages/documents/add-document/add-document.component';
import { ViewDocumentComponent } from './pages/documents/view-document/view-document.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DocumentsComponent,
    HomeComponent,
    AddDocumentComponent,
    ViewDocumentComponent,
  ],
  imports: [
    CommonModule,
    NgSelect2Module,
    HomeRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class HomeModule { }
