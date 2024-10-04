import { AfterViewInit, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { ControlBase } from '../control-base.component';
import { User } from '../../_models/user';
import { FormControl, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { filter, map, Observable, takeUntil } from 'rxjs';
import { UserService } from '../../_services/user.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-member-search-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatAutocompleteOrigin,
    AsyncPipe
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: MemberSearchControlComponent
    }
  ],
  templateUrl: './member-search-control.component.html',
  styleUrl: './member-search-control.component.scss'
})
export class MemberSearchControlComponent extends ControlBase<User[]> {
  static nextId = 0;

  override id: string = `app-member-search-control-${MemberSearchControlComponent.nextId++}`;
  override controlType: string = 'app-project-search-control';

  readonly notAllowedMembers = input<User[]>([]);

  readonly _addedUsers = signal<User[]>([]);
  readonly _users = signal<User[]>([]);
  readonly _userInputControl = new FormControl('');
  readonly _filteredUsers = computed<User[]>(() => {
    return this._users()
      .filter(user =>
        user.fullName.toLowerCase()
          .includes(this._currentUsersName().toLowerCase()) &&
        !this._addedUsers().includes(user) &&
        !this.notAllowedMembers().filter(n => n.userName == user.userName).length);
  });

  private readonly _currentUsersName = signal<string>('');
  private readonly _userService = inject(UserService);

  override ngOnInit() {
    super.ngOnInit();
    this._userService.getUsers()
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
