import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { takeUntil } from 'rxjs';
import { ControlBase } from '../control-base.component';
import { Project } from '../../_models/project.model';
import { ProjectService } from '../../_services/project.service';

@Component({
  selector: 'app-project-search-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatAutocompleteOrigin,
    AsyncPipe
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ProjectSearchControlComponent
    }
  ],
  templateUrl: './project-search-control.component.html',
  styleUrl: './project-search-control.component.scss'
})
export class ProjectSearchControlComponent extends ControlBase<Project[]> {
  static nextId = 0;

  override id: string = `app-project-search-control-${ProjectSearchControlComponent.nextId++}`;
  override controlType: string = 'app-project-search-control';

  readonly notAllowedProjects = input<Project[]>([]);

  readonly _addedProjects = signal<Project[]>([]);
  readonly _projects = signal<Project[]>([]);
  readonly _projectInputControl = new FormControl('');
  readonly _filteredProjects = computed<Project[]>(() => {
    return this._projects()
      .filter(project =>
        project.name.toLowerCase()
          .includes(this._currentProjectsName().toLowerCase()) &&
        !this._addedProjects().includes(project) &&
        !this.notAllowedProjects().filter(p => p.name == project.name).length);
  });

  private readonly _currentProjectsName = signal<string>('');
  private readonly _ProjectService = inject(ProjectService);

  override ngOnInit() {
    super.ngOnInit();
    this._ProjectService.getMyProjects()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: Projects => {
          this._projects.set(Projects);
        }
    });

    this._projectInputControl.valueChanges.subscribe({
      next: value => this._currentProjectsName.set(value ?? '')
    });
  }

  override get empty(): boolean {
    return this._addedProjects().length == 0;
  }

  override get value(): Project[] {
    return this._addedProjects();
  }

  constructor() {
    super();
    effect(() => {
      this._addedProjects();
      untracked(() => this.stateChanges.next());
    });
  }

  override onContainerClick(event: MouseEvent): void {}

  override writeValue(value?: Project[]): void {
    if(value)
      this._addedProjects.set(value);
  }

  override setDescribedByIds(ids: string[]): void {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.project-search-control-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const Project = event.option.value as Project;
    this._addedProjects.update(Projects => [...Projects, Project]);
    this._projectInputControl.setValue('');
    event.option.deselect();
    this.onChange(this.value);
  }

  remove(project: Project) {
    this._addedProjects
      .update(projects => projects.filter(p => p.name !== project.name));
    this.onChange(this.value);
  }
}
