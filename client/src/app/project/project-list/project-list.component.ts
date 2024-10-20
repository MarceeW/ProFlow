import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
import { Project } from '../../_models/project.model';
import { ProjectService } from '../../_services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    MatDivider,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent extends BaseComponent implements OnInit {
  readonly projects = signal<Project[]>([]);
  readonly cols = ['name', 'projectManager', 'action'];
  readonly router = inject(Router);

  protected override _title = 'Ongoing projects';
  private readonly _projectService = inject(ProjectService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this._projectService.getMyProjects()
      .pipe(takeUntil(this._destroy$))
      .subscribe(projects => {
        this.projects.set(projects);
        this.loading.set(false);
      });
  }

  deleteProject(project: Project) {
    this._projectService.deleteProject(project.id!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(_ => {
        this._toastr.info(`Deleted [${project.name}] successfully`);
        this.loadProjects();
      });
  }
}
