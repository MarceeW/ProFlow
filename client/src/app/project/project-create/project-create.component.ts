import { User } from './../../_models/user';
import { Project } from './../../_models/project';
import { MatChipGrid, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { UserService } from '../../_services/user.service';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable, ReplaySubject, map, startWith, takeUntil } from 'rxjs';
import { ProjectService } from '../../_services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-create',
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
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  projectCreateForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    teamLeaders: new FormControl(new Array<User>(), [Validators.required]),
    teamLeader: new FormControl('')
  });
  @ViewChild('teamLeaderInput') teamLeaderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamLeaderChipGrid') teamLeaderChipGrid!: MatChipGrid;

  filteredUsers$!: Observable<User[]>;
  teamLeaders: User[] = [];
  errorStateMatcher = new FormErrorStateMatcher();
  private announcer = inject(LiveAnnouncer);
  private users!: User[];
  private projectManager!: User;

  private ngDestroy$ = new ReplaySubject();
  private displayedTeamLeaderCount = 10;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
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
          this.projectManager = user;
        }
    });
  }

  private _setupFilteredUsers() {
    const teamLeaderCtrl = this.projectCreateForm.controls.teamLeader;
    this.filteredUsers$ = teamLeaderCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) => (filter ? this._filter(filter).splice(0, this.displayedTeamLeaderCount) :
        this._getAvailableUsers().slice(0, this.displayedTeamLeaderCount))),
    )
  }

  private _filter(filter: string): User[] {
    const filterValue = filter.toLowerCase();
    return this._getAvailableUsers().filter(u => u.fullName.toLowerCase().startsWith(filterValue));
  }

  private _getAvailableUsers(): User[] {
    return this.users.filter(user => this.teamLeaders.indexOf(user) < 0);
  }

  teamLeaderSelected(event: MatAutocompleteSelectedEvent) {
    const name = event.option.viewValue;
    const user: User = this.users.filter(u => u.fullName === name)[0];

    this.teamLeaders.push(user);
    this.teamLeaderInput.nativeElement.value = '';

    const teamLeaderCtrl = this.projectCreateForm.controls.teamLeader;
    teamLeaderCtrl.setValue(null);

    const teamLeadersCtrl = this.projectCreateForm.controls.teamLeaders;
    teamLeadersCtrl.setValue(this.teamLeaders);
  }

  removeTeamLeader(teamLeaderName: User) {
    const index = this.teamLeaders.indexOf(teamLeaderName);

    this.teamLeaders.splice(index, 1);
    this.announcer.announce(`Removed ${teamLeaderName}`);

    const teamLeaderCtrl = this.projectCreateForm.controls.teamLeader;
    teamLeaderCtrl.setValue(null);
  }

  createProject() {
    if(!this.projectCreateForm.valid)
      return;

    const project: Project = {
      name: this.projectCreateForm.controls.projectName.value!,
      projectManager: this.projectManager,
      teams: this.teamLeaders.map(tl => ({teamLeader: tl}))
    };
    this.projectService.createProject(project).pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: _ => {
        this.toastr.success(`Project ${project.name} created succesfully!`);
        this.router.navigateByUrl('');
      }
    });
  }
}
