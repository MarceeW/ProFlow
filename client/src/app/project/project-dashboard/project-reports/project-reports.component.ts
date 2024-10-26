import { Component } from '@angular/core';
import { ProjectBaseComponent } from '../project-base.component';

@Component({
  selector: 'app-project-reports',
  standalone: true,
  imports: [],
  templateUrl: './project-reports.component.html',
  styleUrl: './project-reports.component.scss'
})
export class ProjectReportsComponent extends ProjectBaseComponent {
  override itemKey: string = 'reports';
}
