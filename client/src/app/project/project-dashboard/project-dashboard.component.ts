import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../_models/project';
import { ProjectService } from '../../_services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { SidenavItemService } from '../../_services/sidenav-item.service';
import { ProjectDashBoardBase } from './project-dashboard-base.component';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [
    MatDividerModule,
  ],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent extends ProjectDashBoardBase implements OnDestroy {
  override itemKey: string = 'dashboard';
  project = signal<Project | null>(null);

  private readonly _destroy$ = new Subject<void>();
  private readonly _projectService = inject(ProjectService);

  override ngOnInit(): void {
    super.ngOnInit();
    this._projectService.getProject(this.projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: project => this.project.set(project)
      });
  }

  ngOnDestroy(): void {
      this._destroy$.next();
      this._destroy$.complete();
  }
}
