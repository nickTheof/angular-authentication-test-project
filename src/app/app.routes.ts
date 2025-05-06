import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardComponent } from './components/protected/dashboard/dashboard.component';
import { isAuthenticatedGuard } from './shared/services/auth.service';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'page-not-found',
    component: NotFoundComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canMatch: [isAuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
    pathMatch: 'full',
  },
];
