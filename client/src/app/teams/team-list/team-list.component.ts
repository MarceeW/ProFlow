import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Team } from '../../_models/team.model';
import { TeamService } from '../../_services/team.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent implements OnInit, OnDestroy {
  teams = signal<Team[]>([]);
  teamService = inject(TeamService);
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.teamService.getMyTeams().pipe(takeUntil(this.destroy$)).subscribe({
      next: teams => this.teams.set(teams)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
