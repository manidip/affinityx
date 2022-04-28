import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ErrorComponent, NotAuthorizedComponent } from './shared/components/';
import { RouteGuard } from './shared/guards/';

const routes: Routes = [
  {path:"",component:AppComponent,canActivate:[RouteGuard]},
  { path: 'auth', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),},
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),},
  { path: 'user',  loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),},
  {path:"unauthorized",component:NotAuthorizedComponent},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [  RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
