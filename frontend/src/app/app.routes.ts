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
import { BannerManagementComponent } from './components/admin/banner-management/banner-management.component';
import { CartComponent } from './components/client/cart/cart.component';
import { CheckoutComponent } from './components/client/checkout/checkout.component';
import { OauthCallbackComponent } from './components/client/oauth-callback/oauth-callback.component';
import { OrderComponent } from './components/client/order/order.component';
import { AdminOrderComponent } from './components/admin/order/order.component';
import { UserComponent } from './components/admin/user/user.component';

export const routes: Routes = [
    {   
        path: '', 
        component: ClientLayoutComponent, 
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'cart', component: CartComponent },
            { path: 'checkout', component: CheckoutComponent },
            { path: 'order', component: OrderComponent }
        ]},
        {
            path: 'admin',
            component: AdminLayoutComponent,
            canActivate: [authGuard],
            children: [
                { path: 'dashboard', component: DashboardComponent },
                { path: 'products', component: ProductComponent },
                { path: 'categories', component: CategoryComponent },
                { path: 'banners', component: BannerManagementComponent },
                { path: 'orders', component: AdminOrderComponent },
                { path: 'users', component: UserComponent}
            ]
        },
        { path: 'oauth-callback', component: OauthCallbackComponent },

];
