import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent,UserDocumentsComponent,UsersFrontendComponent } from './pages';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserDashboardComponent,
    UsersFrontendComponent,
    UserDocumentsComponent,
  ],
  imports: [
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
