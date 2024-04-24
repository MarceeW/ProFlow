import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { LoginComponent } from './account/login/login.component';
import { adminGuard } from './_guards/admin.guard';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { RegisterComponent } from './account/register/register.component';
import { ManageComponent } from './admin/accounts/manage/manage.component';

export const routes: Routes = [
  { path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        runGuardsAndResolvers: 'always',
        canActivate: [adminGuard],
        component: AdminMainComponent,
        children: []
      },
    ]
  },
  { path: 'login',
    runGuardsAndResolvers: 'always',
    canActivate: [loginGuard],
    component: LoginComponent
  },
  { path: 'register',
    runGuardsAndResolvers: 'always',
    canActivate: [loginGuard],
    component: RegisterComponent
  }
];
