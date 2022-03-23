import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { RouteGuard } from './shared/guards/route.guard';

const routes: Routes = [
  {path:"",component:AppComponent,canActivate:[RouteGuard]},
  {path:"unauthorized",component:NotAuthorizedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
