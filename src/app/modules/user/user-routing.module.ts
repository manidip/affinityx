import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent,UserDocumentsComponent,UsersFrontendComponent } from './pages';
import { AuthenticationGuard } from '../../shared/guards';

const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: '', component: UsersFrontendComponent,canActivateChild:[AuthenticationGuard],children: [
      { path: 'dashboard',  component: UserDashboardComponent},
      { path: 'documents/:resourceSlug',  component: UserDocumentsComponent},
      {path: 'documents', redirectTo: 'dashboard', pathMatch: 'full'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
