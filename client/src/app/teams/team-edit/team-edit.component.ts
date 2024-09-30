import { TeamService } from './../../_services/team.service';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Team } from '../../_models/team';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MemberSearchControlComponent } from '../../_controls/member-search-control/member-search-control.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [
    MatDividerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MemberSearchControlComponent
  ],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent implements OnInit, OnDestroy {

  readonly _team = signal<Team | null>(null);
  readonly memberControl = new FormControl([]);
  private readonly _teamService = inject(TeamService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroy$ = new Subject<void>();

  ngOnInit(): void {
    const teamId = this._route.snapshot.paramMap.get('id');
    if(teamId) {
      this._teamService.getTeam(teamId).pipe(takeUntil(this._destroy$))
      .subscribe({
        next: team => this._team.set(team)
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
