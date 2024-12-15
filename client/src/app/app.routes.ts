import { Routes } from '@angular/router';
import { RoleType } from './_enums/role-type.enum';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { roleGuard } from './_guards/role.guard';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ManageSprintsComponent } from './project/project-dashboard/manage-sprints/manage-sprints.component';
import { ProductBacklogComponent } from './project/project-dashboard/product-backlog/product-backlog.component';
import { ProjectDashboardComponent } from './project/project-dashboard/project-dashboard.component';
import { ProjectSettingsComponent } from './project/project-dashboard/project-settings/project-settings.component';
import { ScrumBoardComponent } from './project/project-dashboard/scrum-board/scrum-board.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { TeamDetailsComponent } from './teams/team-details/team-details.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
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
        path: 'user-profile/:id',
        component: UserProfileComponent
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
            path: 'project-dashboard',
            children: [
              {
                path: ':id',
                component: ProjectDashboardComponent,
              },
              {
                path: 'product-backlog/:id',
                component: ProductBacklogComponent,
              },
              {
                path: 'manage-sprints/:id',
                component: ManageSprintsComponent,
              },
              {
                path: 'settings/:id',
                component: ProjectSettingsComponent
              },
              {
                path: 'scrum-board/:id',
                component: ScrumBoardComponent
              }
            ]
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
        data: { role: RoleType.User },
        children: [
          {
            path: '',
            component: TeamListComponent
          },
          {
            path: 'team/:id',
            component: TeamDetailsComponent
          },
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
