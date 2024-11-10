import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
import { MemberSearchControlComponent } from '../../_controls/member-search-control/member-search-control.component';
import { ProjectSearchControlComponent } from '../../_controls/project-search-control/project-search-control.component';
import { Project } from '../../_models/project.model';
import { Team } from '../../_models/team.model';
import { User } from '../../_models/user.model';
import { TeamService } from '../../_services/team.service';
import { UserPictureDirective } from '../../_directives/user-picture.directive';
import { VelocityChartComponent } from '../../velocity-chart/velocity-chart.component';
import { MatMenuModule } from '@angular/material/menu';
import { SkillService } from '../../_services/skill.service';
import { Skill } from '../../_models/skill.model';
import { UserService } from '../../_services/user.service';
import { UserSkill } from '../../_models/user-skill.model';
import { UserStat } from '../../_models/user-stat.model';
import { computeMsgId } from '@angular/compiler';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-team-details',
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
    ProjectSearchControlComponent,
    UserPictureDirective,
    VelocityChartComponent,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.scss'
})
export class TeamDetailsComponent extends BaseComponent {
  readonly memberControl = new FormControl<User[]>([]);
  readonly projectControl = new FormControl<Project[]>([]);
  readonly memberSkills = signal<Map<string, UserSkill[]>>(new Map());
  readonly memberStats = signal<Map<string, UserStat>>(new Map());
  readonly team = signal<Team | null>(null);

  readonly members = computed<User[]>(() => {
    return this.team()?.members ?? [];
  });

  private readonly _teamService = inject(TeamService);
  private readonly _userService = inject(UserService);
  private readonly _accountService = inject(AccountService);
  private readonly _route = inject(ActivatedRoute);

  override ngOnInit(): void {
    super.ngOnInit();
    this.readTeam();
  }

  removeProject(project: Project) {
    this._teamService
      .removeProjects(this.team()!.id!, [project])
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Successfully removed project!');
          this.readTeam();
        }
      });
  }

  addProjects() {
    this._teamService
      .addToProject(this.team()!.id!, this.projectControl.value!)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Successfully added to project!');
          this.projectControl.setValue([]);
          this.readTeam();
        }
      });
  }

  addMembers() {
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

  isTeamLeader(user: User) {
    return this.team()?.teamLeader.id === user.id;
  }

  isCurrentUserTeamLeader() {
    const user = this._accountService.getCurrentUser();
    return this.team()?.teamLeader.id === user?.id;
  }

  removeMember(member: User) {
    this._teamService
      .removeMembers(this.team()!.id!, [member])
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this._toastr.success('Team member(s) removed successfully!');
          this.readTeam();
        }
      });
  }

  _getSkillBarWidth(userSkill: UserSkill) {
    return userSkill.skillLevel / 5 * 100;
  }

  private loadMemberSkills() {
    this.team()?.members.forEach(m => {
      this._userService.getUserSkills(m.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(skills => {
        this.memberSkills.update(memberSkills => {
          memberSkills.set(m.id, skills
            .sort((s1, s2) => s2.skillLevel - s1.skillLevel)
            .slice(0, 5));
          return memberSkills;
        });
      });
    });
  }

  private loadMemberStats() {
    this.team()?.members.forEach(m => {
      this._userService.getUserStats(m.id)
      .pipe(takeUntil(this._destroy$))
      .subscribe(stats => {
        this.memberStats.update(memberStats => {
          memberStats.set(m.id, stats);
          return memberStats;
        });
      });
    });
  }

  private readTeam() {
    const teamId = this._route.snapshot.paramMap.get('id');
    if(teamId) {
      this._teamService.getTeam(teamId).pipe(takeUntil(this._destroy$))
      .subscribe(team => {
        this.team.set(team);
        this.title.set(team.name);
        this.loadMemberSkills();
        this.loadMemberStats();
      });
    }
  }
}
