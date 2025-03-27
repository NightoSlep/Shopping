import { Routes } from '@angular/router';
import { HomeComponent } from './components/client/home/home.component';
import { LoginComponent } from './components/client/login/login.component';
import { RegisterComponent } from './components/client/register/register.component';
import { ClientLayoutComponent } from './components/client/client-layout/client-layout.component';

export const routes: Routes = [
    {   
        path: '', 
        component: ClientLayoutComponent, 
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]},
];
