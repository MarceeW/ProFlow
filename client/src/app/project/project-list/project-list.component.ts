import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ProjectService } from '../../_services/project.service';
import { Project } from '../../_models/project';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

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
export class ProjectListComponent implements OnInit, OnDestroy {
  readonly projects = signal<Project[]>([]);
  readonly cols = ['name', 'projectManager', 'action'];

  private readonly ngDestroy$ = new ReplaySubject<boolean>(1);

  constructor(
    public projectService: ProjectService,
    public router: Router) {}

  ngOnInit(): void {
    this.projectService.getProjects().pipe(takeUntil(this.ngDestroy$))
      .subscribe({
        next: projects => this.projects.set(projects),
        error: error => console.error(error)
    });
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
