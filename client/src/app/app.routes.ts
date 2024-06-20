import { projectManagerGuard } from './_guards/project-manager.guard';
import { AccountPageComponent } from './account/account-page/account-page.component';
import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { LoginComponent } from './account/login/login.component';
import { adminGuard } from './_guards/admin.guard';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountSettingsComponent } from './account/account-settings/account-settings.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';

export const routes: Routes = [
  { path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [adminGuard],
        component: AdminMainComponent,
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            component: AccountPageComponent
          },
          {
            path: 'settings',
            component: AccountSettingsComponent
          }
        ]
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            component: ProjectListComponent
          },
          {
            path: ':id',
            component: ProjectDetailsComponent
          },
          {
            path: 'create',
            canActivate: [projectManagerGuard],
            component: ProjectCreateComponent
          }
        ]
      },
    ]
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [loginGuard],
    component: RegisterComponent
  }
];
