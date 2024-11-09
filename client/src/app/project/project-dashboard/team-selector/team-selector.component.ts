import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Project, ProjectTeam } from '../../../_models/project.model';
import { computeMsgId } from '@angular/compiler';
import { Team } from '../../../_models/team.model';
import { AccountService } from '../../../_services/account.service';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './team-selector.component.html',
  styleUrl: './team-selector.component.scss'
})
export class TeamSelectorComponent implements OnInit {
  readonly project = input.required<Project>();
  readonly selectionChange = output<ProjectTeam>();
  readonly selectControl = new FormControl<ProjectTeam | undefined>(undefined);
  readonly teams = computed<ProjectTeam[]>(() => {
    const userId = this._accountService.getCurrentUser()!.id;
    const isProjectManager = this.project().projectManager.id == userId;
    return this.project().teams.filter(t => isProjectManager || t.memberIds.includes(userId));
  });

  private readonly _accountService = inject(AccountService);

  get value() {
    return this.selectControl.value;
  }

  ngOnInit(): void {
    this.selectControl.valueChanges.subscribe(value => {
      this.selectionChange.emit(value!);
    });
    this.selectControl.setValue(this.teams()[0]);
  }

  compareTeam(team1: ProjectTeam, team2: ProjectTeam) {
    return team1.name === team2.name;
  }
}
