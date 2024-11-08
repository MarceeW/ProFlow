import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseComponent } from '../../_component-base/base.component';
import { MemberSearchControlComponent } from '../../_controls/member-search-control/member-search-control.component';
import { UserPictureDirective } from '../../_directives/user-picture.directive';
import { Team } from '../../_models/team.model';
import { User } from '../../_models/user.model';
import { AccountService } from '../../_services/account.service';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_DIALOG_CONFIG } from '../../injection-tokens.config';

@Component({
  selector: 'app-team-create-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DatePipe,
    UserPictureDirective,
    MemberSearchControlComponent
  ],
  templateUrl: './team-create-dialog.component.html',
  styleUrl: './team-create-dialog.component.scss',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_DIALOG_CONFIG
    }
  ]
})
export class TeamCreateDialogComponent extends BaseComponent {
  readonly dialogRef = inject(MatDialogRef<TeamCreateDialogComponent>);
  readonly teamCreateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    members: new FormControl<User[]>([]),
    teamLeader: new FormControl<User | undefined>(undefined)
  });

  private readonly _accountService = inject(AccountService);
  readonly currentUser = signal<User>(this._accountService.getCurrentUser()!);

  getFormValue() {
    this.teamCreateForm.controls
      .teamLeader.setValue(this._accountService.getCurrentUser());
    return this.teamCreateForm.value as Team;
  }
}
