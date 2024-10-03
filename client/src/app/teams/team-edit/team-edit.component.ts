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
import { Team } from '../../_models/team';
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
    MemberSearchControlComponent
  ],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent implements OnInit, OnDestroy {

  readonly memberControl = new FormControl<User[]>([]);

  readonly team = signal<Team | null>(null);
  readonly membersToRemove = signal<User[]>([]);

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
    return this.canRemovedMembersSave() || this.canAddedMembersSave();
  }

  onSave() {
    if(this.canRemovedMembersSave()) {
      this.onRemoveMembersSave();
    }
    if(this.canAddedMembersSave()) {
      this.onAddMembersSave();
    }
  }

  onRemoveClicked(member: User) {
    const idx = this.getMemberIdxInRemovedMembers(member);
    if(idx == -1)
      this.membersToRemove.update(members => [...members, member]);
    else
      this.membersToRemove.update(members => {
        members.splice(idx, 1);
        return members;
      });
  }

  onAddMembersSave() {
    this._teamService
      .addMembers(this.team()!.id!, this.memberControl.value!)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Team members added!');
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
          this._toastr.success('Team members removed!');
          this.membersToRemove.set([]);
          this.readTeam();
        }
      });
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

  isMemberMarkedToRemove(member: User) {
    return this.getMemberIdxInRemovedMembers(member) != -1;
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
