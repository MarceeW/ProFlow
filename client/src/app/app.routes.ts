import { Routes } from '@angular/router';
import { RoleType } from './_enums/role-type.enum';
import { authGuard } from './_guards/auth.guard';
import { loginGuard } from './_guards/login.guard';
import { roleGuard } from './_guards/role.guard';
import { AccountPageComponent } from './account/account-page/account-page.component';
import { AccountSettingsComponent } from './account/account-settings/account-settings.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { HomeComponent } from './home/home.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ManageSprintsComponent } from './project/project-dashboard/manage-sprints/manage-sprints.component';
import { ProductBacklogComponent } from './project/project-dashboard/product-backlog/product-backlog.component';
import { ProjectDashboardComponent } from './project/project-dashboard/project-dashboard.component';
import { ProjectReportsComponent } from './project/project-dashboard/project-reports/project-reports.component';
import { ProjectSettingsComponent } from './project/project-dashboard/project-settings/project-settings.component';
import { ProjectTimelineComponent } from './project/project-dashboard/project-timeline/project-timeline.component';
import { ScrumBoardComponent } from './project/project-dashboard/scrum-board/scrum-board.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamListComponent } from './teams/team-list/team-list.component';

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
            path: 'project-dashboard',
            children: [
              {
                path: ':id',
                component: ProjectDashboardComponent,
              },
              {
                path: 'timeline/:id',
                component: ProjectTimelineComponent
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
                path: 'reports/:id',
                component: ProjectReportsComponent
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
