import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersFrontendComponent } from './pages/users-frontend.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';
import { UserDocumentsComponent } from './pages/user-documents/user-documents.component';

const routes: Routes = [
  { 
    path: 'user', component: UsersFrontendComponent, canActivateChild:[AuthenticationGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard',  component: UserDashboardComponent},
      { path: 'documents/:resourceSlug',  component: UserDocumentsComponent},
      {path: 'documents', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
