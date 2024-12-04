import { Component, inject, signal } from '@angular/core';
import { BaseComponent } from '../_component-base/base.component';
import { ProjectService } from '../_services/project.service';
import { Project } from '../_models/project.model';
import { takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {
  readonly lastFiveProjects = signal<Project[]>([]);
  private readonly _projectService = inject(ProjectService);

  override ngOnInit(): void {
    this._projectService.getMyProjects()
      .pipe(takeUntil(this._destroy$))
      .subscribe(projects => this.lastFiveProjects.set(projects.slice(0,5)));
  }
}
