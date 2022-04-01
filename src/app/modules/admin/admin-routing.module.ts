
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard,AuthenticationGuard } from '../../shared/guards/';
import { 
  AdminComponent,DashboardComponent,AddDocumentComponent,
  ViewDocumentComponent,DocumentsComponent,PartnersComponent, 
  ProductsComponent,ResourcesComponent,UsersComponent,AddUserComponent,AddPartnerComponent
} from './pages';

const routes: Routes = [
  { path: 'admin', component: AdminComponent,canActivateChild:[AuthenticationGuard,AuthorizationGuard],
      children :[
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent },
        { path: 'documents/edit/:id/:slug', component: AddDocumentComponent },
        { path: 'documents/add', component: AddDocumentComponent },
        { path: 'documents/:id/:slug', component: ViewDocumentComponent },
        { path: 'documents', component: DocumentsComponent },
        { path: 'users/edit/:id/:slug', component:  AddUserComponent },
        { path: 'users/add', component: AddUserComponent },
        { path: 'users', component: UsersComponent },
        { path: 'partners/add', component: AddPartnerComponent },
        { path: 'partners/edit/:id/:slug', component:  AddPartnerComponent },
        { path: 'partners', component: PartnersComponent},
        { path: 'resources', component: ResourcesComponent},
        { path: 'products', component: ProductsComponent},
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
