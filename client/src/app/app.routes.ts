import { roleGuard } from './_guards/role.guard';
import { AccountPageComponent } from './account/account-page/account-page.component';
import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { LoginComponent } from './account/login/login.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountSettingsComponent } from './account/account-settings/account-settings.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { HomeComponent } from './home/home.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { RoleType } from './_enums/role-type.enum';

export const routes: Routes = [
  { path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'admin',
        data: { role: RoleType.Administrator },
        canActivate: [roleGuard],
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
        data: { role: RoleType.ProjectManager },
        children: [
          {
            path: '',
            component: ProjectListComponent
          },
          {
            path: 'project/:id',
            component: ProjectDetailsComponent
          },
          {
            path: 'create',
            canActivate: [roleGuard],
            component: ProjectCreateComponent
          }
        ]
      },
      {
        path: 'teams',
        canActivate: [roleGuard],
        data: { role: RoleType.TeamLeader },
        children: [
          {
            path: '',
            component: TeamListComponent
          },
          {
            path: 'team/:id',
            component: TeamEditComponent
          },
          {
            path: 'create',
            component: TeamCreateComponent
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
