import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateTPipe,SafeHtmlPipe } from "../shared/pipes";
import { HeaderComponent,FooterComponent,HeaderTitleComponent,InPageHeaderComponent,
  NotAuthorizedComponent,ErrorComponent,PaginationComponent,NoResultComponent } 
  from './components';
import { NgSelect2Module } from 'ng-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent, 
    PaginationComponent, 
    NoResultComponent, 
    InPageHeaderComponent, 
    HeaderTitleComponent,
    DateTPipe,
    SafeHtmlPipe, 
    NotAuthorizedComponent, 
    ErrorComponent,
    ModalPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelect2Module,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    NgSelect2Module,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    NoResultComponent,
    InPageHeaderComponent,
    HeaderTitleComponent,
    DateTPipe,
    SafeHtmlPipe,
    ModalPopupComponent
  ]
})
export class SharedModule { }
