import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
import { Team } from '../../_models/team.model';
import { TeamService } from '../../_services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamCreateDialogComponent } from '../team-create-dialog/team-create-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountService } from '../../_services/account.service';
import { RoleType } from '../../_enums/role-type.enum';
import { UserPictureDirective } from '../../_directives/user-picture.directive';
import { UserSkill } from '../../_models/user-skill.model';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    UserPictureDirective
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent extends BaseComponent {
  readonly teams = signal<Team[]>([]);
  readonly accountService = inject(AccountService);
  readonly RoleType = RoleType;

  protected override _title = 'Teams';

  private readonly _teamService = inject(TeamService);
  private readonly _dialog = inject(MatDialog);

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadTeams();
  }

  loadTeams() {
    this._teamService.getMyTeams()
      .pipe(takeUntil(this._destroy$))
      .subscribe(teams => {
        this.teams.set(teams);
      });
  }

  openCreateTeamDialog() {
    const dialogRef = this._dialog.open(TeamCreateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: Team) => {
      if(!result)
        return;
      this._teamService.createTeam(result)
        .pipe(takeUntil(this._destroy$))
        .subscribe(_ => {
          this._toastr.success("Team created successfully");
          this.loadTeams();
        });
    });
  }

  deleteTeam(team: Team) {
    this._teamService.deleteTeam(team.id!)
        .pipe(takeUntil(this._destroy$))
        .subscribe(_ => {
          this._toastr.info("Team deleted");
          this.loadTeams();
        });
  }

  _getSkillBarWidth(userSkills: UserSkill[], userSkill: UserSkill):number {
    const maxLevel = Math.max(...userSkills.map(us => us.skillLevel));
    return userSkill.skillLevel / maxLevel * 100;
  }
}
