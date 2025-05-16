import { Routes } from '@angular/router';
import { HomeComponent } from './components/client/home/home.component';
import { LoginComponent } from './components/client/login/login.component';
import { RegisterComponent } from './components/client/register/register.component';
import { ClientLayoutComponent } from './components/client/client-layout/client-layout.component';
import { ProfileComponent } from './components/client/profile/profile.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductComponent } from './components/admin/product/product.component';
import { CategoryComponent } from './components/admin/category/category.component';

export const routes: Routes = [
    {   
        path: '', 
        component: ClientLayoutComponent, 
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'profile', component: ProfileComponent}
        ]},
        {
            path: 'admin',
            component: AdminLayoutComponent,
            canActivate: [authGuard],
            children: [
                { path: 'dashboard', component: DashboardComponent },
                { path: 'products', component: ProductComponent },
                { path: 'categories', component: CategoryComponent },
            ]
          }
];
