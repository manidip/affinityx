import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout.component';
import { RegisterComponent } from './pages/register/register.component';

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
