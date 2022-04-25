import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NoResultComponent } from './components/no-result/no-result.component';
import { InPageHeaderComponent } from './components/in-page-header/in-page-header.component';
import { HeaderTitleComponent } from './components/header-title/header-title.component';
import { DateTPipe } from "../shared/pipes/dateT";
import { SafeHtmlPipe } from "../shared/pipes/safeHtml";
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent, 
    PaginationComponent, 
    NoResultComponent, InPageHeaderComponent, HeaderTitleComponent,DateTPipe,SafeHtmlPipe, NotAuthorizedComponent, ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    NoResultComponent,
    InPageHeaderComponent,
    HeaderTitleComponent,
    DateTPipe,
    SafeHtmlPipe
  ]
})
export class SharedModule { }
