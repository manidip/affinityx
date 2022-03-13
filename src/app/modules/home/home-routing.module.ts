
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../shared/guards/authentication.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home.component';
import { AddDocumentComponent } from './pages/documents/add-document/add-document.component';
import { ViewDocumentComponent } from './pages/documents/view-document/view-document.component';




const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivateChild:[AuthenticationGuard],
      children :[
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent,},
        { path: 'documents', component: DocumentsComponent },
        { path: 'documents/:id', component: ViewDocumentComponent },
        { path: 'documents/add/', component: AddDocumentComponent },
        { path: 'documents/add/:id', component: AddDocumentComponent }
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
