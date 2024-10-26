import { Component } from '@angular/core';
import { ProjectBaseComponent } from '../project-base.component';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsComponent extends ProjectBaseComponent {
  override itemKey: string = 'settings';
}
