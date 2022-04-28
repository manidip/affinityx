import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent,LogoutComponent,RegisterComponent,ForgotPasswordComponent } from './pages';

const routes: Routes = [
  {   path: 'login', component: LoginComponent},
  {   path: 'logout', component: LogoutComponent},
  {   path: 'register', component: RegisterComponent},
  {   path: 'forgot-password', component: ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
