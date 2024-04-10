import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { LoginComponent } from './account/login/login.component';

export const routes: Routes = [
  { path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: []
  },
  { path: 'login',
    runGuardsAndResolvers: 'always',
    canActivate: [loginGuard],
    component: LoginComponent
  }
];
