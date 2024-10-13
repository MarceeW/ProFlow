import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { MemberSearchControlComponent } from '../../_controls/member-search-control/member-search-control.component';
import { ProjectSearchControlComponent } from '../../_controls/project-search-control/project-search-control.component';
import { Project } from '../../_models/project.model';
import { Team } from '../../_models/team.model';
import { User } from '../../_models/user';
import { TeamService } from './../../_services/team.service';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MemberSearchControlComponent,
    ProjectSearchControlComponent
  ],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent implements OnInit, OnDestroy {

  readonly memberControl = new FormControl<User[]>([]);
  readonly projectControl = new FormControl<Project[]>([]);

  readonly team = signal<Team | null>(null);
  readonly membersToRemove = signal<User[]>([]);
  readonly projectsToRemove = signal<Project[]>([]);

  private readonly _teamService = inject(TeamService);
  private readonly _toastr = inject(ToastrService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.readTeam();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  canSaveHappen() {
    return this.canRemovedMembersSave() || this.canAddedMembersSave()
      || this.canRemovedProjectsSave() || this.canAddedProjectsSave();
  }

  onSave() {
    if(this.canRemovedMembersSave()) {
      this.onRemoveMembersSave();
    }
    if(this.canAddedMembersSave()) {
      this.onAddMembersSave();
    }
    if(this.canRemovedProjectsSave()) {
      this.onRemoveProjectsSave();
    }
    if(this.canAddedProjectsSave()) {
      this.onAddProjectsSave();
    }
  }

  onMemberRemoveClicked(member: User) {
    const idx = this.getMemberIdxInRemovedMembers(member);
    if(idx == -1)
      this.membersToRemove.update(members => [...members, member]);
    else
      this.membersToRemove.update(members => {
        members.splice(idx, 1);
        return members;
      });
  }

  onProjectRemoveClicked(project: Project) {
    const idx = this.getProjectIdxInRemovedProjects(project);
    if(idx == -1)
      this.projectsToRemove.update(projects => [...projects, project]);
    else
      this.projectsToRemove.update(projects => {
        projects.splice(idx, 1);
        return projects;
      });
  }

  onRemoveProjectsSave() {
    this._teamService
      .removeProjects(this.team()!.id!, this.projectsToRemove())
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Successfully removed from project(s)!');
          this.projectsToRemove.set([]);
          this.readTeam();
        }
      });
  }

  onAddProjectsSave() {
    this._teamService
      .addToProject(this.team()!.id!, this.projectControl.value!)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Successfully added to project(s)!');
          this.projectControl.setValue([]);
          this.readTeam();
        }
      });
  }

  onAddMembersSave() {
    this._teamService
      .addMembers(this.team()!.id!, this.memberControl.value!)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Team member(s) added successfully!');
          this.memberControl.setValue([]);
          this.readTeam();
        }
      });
  }

  onRemoveMembersSave() {
    this._teamService
      .removeMembers(this.team()!.id!, this.membersToRemove())
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Team member(s) removed successfully!');
          this.membersToRemove.set([]);
          this.readTeam();
        }
      });
  }

  isMemberMarkedToRemove(member: User) {
    return this.getMemberIdxInRemovedMembers(member) != -1;
  }

  isProjectMarkedToRemove(project: Project) {
    return this.getProjectIdxInRemovedProjects(project) != -1;
  }

  private getProjectIdxInRemovedProjects(project: Project) {
    return this.projectsToRemove().indexOf(project);
  }

  private canRemovedProjectsSave() {
    return !!this.projectsToRemove().length;
  }

  private canAddedProjectsSave() {
    return this.projectControl.value!.length > 0
  }

  private canRemovedMembersSave() {
    return !!this.membersToRemove().length;
  }

  private canAddedMembersSave() {
    return this.memberControl.value!.length > 0
  }

  private getMemberIdxInRemovedMembers(member: User) {
    return this.membersToRemove().indexOf(member);
  }

  private readTeam() {
    const teamId = this._route.snapshot.paramMap.get('id');
    if(teamId) {
      this._teamService.getTeam(teamId).pipe(takeUntil(this._destroy$))
      .subscribe({
        next: team => this.team.set(team)
      });
    }
  }
}
