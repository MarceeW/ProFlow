import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MemberSearchControlComponent } from "../../_controls/member-search-control/member-search-control.component";
import { Team } from '../../_models/team.model';
import { User } from '../../_models/user';
import { TeamService } from '../../_services/team.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    MatOptionModule,
    MatChipsModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MemberSearchControlComponent
],
  templateUrl: './team-create.component.html',
  styleUrl: './team-create.component.scss'
})
export class TeamCreateComponent implements OnInit, OnDestroy {
  readonly currentUser = signal<User | null>(null);
  readonly teamCreateForm = new FormGroup({
    teamName: new FormControl('', [Validators.required]),
    members: new FormControl<User[]>([], [Validators.required]),
  });

  private ngDestroy$ = new ReplaySubject();

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser()?.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: user => {
        this.currentUser.set(user);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  createTeam() {
    if(!this.teamCreateForm.valid)
      return;

    const team: Team = {
      name: this.teamCreateForm.controls.teamName.value!,
      members: this.teamCreateForm.controls.members.value!
    };

    this.teamService.createTeam(team).pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: _ => {
        this.toastr.success(`Team ${team.name} created successfully!`);
        this.router.navigateByUrl('teams');
      }
    });
  }
}
