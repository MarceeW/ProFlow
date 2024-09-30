import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../../_services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../_models/project';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project?: Project;
  private ngDestroy$ = new ReplaySubject(1);

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if(projectId) {
      this.projectService.getProject(projectId).pipe(takeUntil(this.ngDestroy$))
        .subscribe({
          next: project => this.project = project
        });
    }
  }
}
