import { AdminComponent } from './pages/admin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { UsersComponent } from './pages/users/users.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { ProductsComponent } from './pages/products/products.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { AuthenticationGuard } from 'src/app/shared/guards/authentication.guard';

const routes: Routes = [
    {   path: 'admin', component: AdminComponent,canActivateChild:[AuthenticationGuard],
        children :[
            { path: '', redirectTo: 'dashboard',pathMatch: 'full'},
            { path: 'dashboard', component: AdminDashboardComponent},
            { path: 'users', component: UsersComponent },
            { path: 'parners', component: PartnersComponent},
            { path: 'resourses', component: ResourcesComponent},
            { path: 'products', component: ProductsComponent},
            { path: 'documents', component: DocumentsComponent},
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
