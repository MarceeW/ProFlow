import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../../_services/project.service';
import { Project } from '../../_models/project';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    MatDivider,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  private ngDestroy$ = new ReplaySubject<boolean>(1);

  constructor(
    public projectService: ProjectService,
    public router: Router) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  ngOnInit(): void {
    this.projectService.getProjects().pipe(takeUntil(this.ngDestroy$))
      .subscribe({
        next: projects => this.projects = projects,
        error: error => console.error(error)
      });
  }
}
