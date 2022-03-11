import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../shared/guards/authentication.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivateChild:[AuthenticationGuard],
      children :[
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent,},
        { path: 'documents', component: DocumentsComponent},
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
