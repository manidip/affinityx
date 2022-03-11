import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NoResultComponent } from './components/no-result/no-result.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent, 
    PaginationComponent, 
    NoResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [HeaderComponent,FooterComponent,PaginationComponent,NoResultComponent]
})
export class SharedModule { }
