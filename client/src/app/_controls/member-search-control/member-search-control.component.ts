import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntil } from 'rxjs';
import { UserPictureDirective } from '../../_directives/user-picture.directive';
import { RoleType } from '../../_enums/role-type.enum';
import { User } from '../../_models/user.model';
import { UserService } from '../../_services/user.service';
import { ControlBase } from '../control-base.component';

@Component({
  selector: 'app-member-search-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatAutocompleteOrigin,
    MatProgressBarModule,
    AsyncPipe,
    UserPictureDirective
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: MemberSearchControlComponent
    },
  ],
  templateUrl: './member-search-control.component.html',
  styleUrl: './member-search-control.component.scss'
})
export class MemberSearchControlComponent extends ControlBase<User[]> {
  static nextId = 0;

  override id: string = `app-member-search-control-${MemberSearchControlComponent.nextId++}`;
  override controlType: string = 'app-project-search-control';

  readonly maxSelectCount = input<number | undefined>(undefined);
  readonly allowedRoles = input<RoleType[] | undefined>(undefined);
  readonly notAllowedMembers = input<User[]>([]);

  readonly _addedUsers = signal<User[]>([]);
  readonly _users = signal<User[]>([]);
  readonly _userInputControl = new FormControl('');
  readonly _filteredUsers = computed<User[]>(() => {
    return this._users()
      .filter(user =>
        user.fullName.toLowerCase()
          .includes(this._currentUsersName().toLowerCase()) &&
        !this._addedUsers().find(u => u.id == user.id) &&
        !this.notAllowedMembers().find(u => u.id == user.id));
  });

  override get errorState(): boolean {
    return super.errorState
      || (!!this.maxSelectCount() && this._addedUsers().length > this.maxSelectCount()!);
  }

  private readonly _currentUsersName = signal<string>('');
  private readonly _userService = inject(UserService);

  override ngOnInit() {
    super.ngOnInit();
    this._userService.getUsers(this.allowedRoles())
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: users => {
          this._users.set(users);
        }
    });

    this._userInputControl.valueChanges.subscribe({
      next: value => this._currentUsersName.set(value ?? '')
    });
  }

  override get empty(): boolean {
    return this._addedUsers().length == 0;
  }

  override get value(): User[] {
    return this._addedUsers();
  }

  constructor() {
    super();
    effect(() => {
      this._addedUsers();
      untracked(() => this.stateChanges.next());
    });
  }

  override onContainerClick(event: MouseEvent): void {}

  override writeValue(value?: User[]): void {
    if(value)
      this._addedUsers.set(value);
  }

  override setDescribedByIds(ids: string[]): void {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.member-search-control-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const user = event.option.value as User;
    this._addedUsers.update(users => [...users, user]);
    this._userInputControl.setValue('');
    event.option.deselect();
    this.onChange(this.value);
  }

  remove(user: User) {
    this._addedUsers
      .update(users => users.filter(u => u.userName !== user.userName));
    this.onChange(this.value);
  }
}
