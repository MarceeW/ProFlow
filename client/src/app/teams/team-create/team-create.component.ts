import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipGrid, MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, takeUntil, startWith, map } from 'rxjs';
import { Project } from '../../_models/project';
import { User } from '../../_models/user';
import { ProjectService } from '../../_services/project.service';
import { UserService } from '../../_services/user.service';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TeamService } from '../../_services/team.service';
import { Team } from '../../_models/team';

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
  ],
  templateUrl: './team-create.component.html',
  styleUrl: './team-create.component.scss'
})
export class TeamCreateComponent {
  teamCreateForm = new FormGroup({
    teamName: new FormControl('', [Validators.required]),
    members: new FormControl(new Array<User>(), [Validators.required]),
    member: new FormControl('')
  });
  @ViewChild('memberInput')
  memberInput!: ElementRef<HTMLInputElement>;

  @ViewChild('memberChipGrid')
  memberChipGrid!: MatChipGrid;

  filteredUsers$!: Observable<User[]>;
  members: User[] = [];
  errorStateMatcher = new FormErrorStateMatcher();
  private announcer = inject(LiveAnnouncer);
  private users!: User[];
  private member!: User;

  private ngDestroy$ = new ReplaySubject();
  private displayedmemberCount = 10;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  ngOnInit(): void {
    this.userService.getUsers().pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: users => {
        this.users = users;
        this._setupFilteredUsers();
      }
    });

    this.userService.getCurrentUser()?.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
        next: user => {
          this.member = user;
        }
    });
  }

  private _setupFilteredUsers() {
    const memberCtrl = this.teamCreateForm.controls.member;
    this.filteredUsers$ = memberCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) => (filter ? this._filter(filter).splice(0, this.displayedmemberCount) :
        this._getAvailableUsers().slice(0, this.displayedmemberCount))),
    )
  }

  private _filter(filter: string): User[] {
    const filterValue = filter.toLowerCase();
    return this._getAvailableUsers().filter(u => u.fullName.toLowerCase().startsWith(filterValue));
  }

  private _getAvailableUsers(): User[] {
    return this.users.filter(user => this.members.indexOf(user) < 0);
  }

  memberselected(event: MatAutocompleteSelectedEvent) {
    const name = event.option.viewValue;
    const user: User = this.users.filter(u => u.fullName === name)[0];

    this.members.push(user);
    this.memberInput.nativeElement.value = '';

    const memberCtrl = this.teamCreateForm.controls.member;
    memberCtrl.setValue(null);

    const membersCtrl = this.teamCreateForm.controls.members;
    membersCtrl.setValue(this.members);
  }

  removeMember(memberName: User) {
    const index = this.members.indexOf(memberName);

    this.members.splice(index, 1);
    this.announcer.announce(`Removed ${memberName}`);

    const memberCtrl = this.teamCreateForm.controls.member;
    memberCtrl.setValue(null);
  }

  createTeam() {
    if(!this.teamCreateForm.valid)
      return;

    const team: Team = {
      name: this.teamCreateForm.controls.teamName.value!,
      members: this.members
    };
    this.teamService.createTeam(team).pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: _ => {
        this.toastr.success(`Team ${team.name} created succesfully!`);
        this.router.navigateByUrl('teams');
      }
    });
  }
}
