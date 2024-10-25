import { AsyncPipe } from '@angular/common';
import { Component, computed, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, take, takeUntil } from 'rxjs';
import { BaseComponent } from '../_component-base/base.component';
import { UserPictureDirective } from '../_directives/user-picture.directive';
import { AccountSettingsModel } from '../_models/account-settings-model';
import { Skill } from '../_models/skill.model';
import { UserSkill } from '../_models/user-skill.model';
import { User } from '../_models/user.model';
import { AccountService } from '../_services/account.service';
import { SkillService } from '../_services/skill.service';
import { UserService } from '../_services/user.service';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { UserStat } from '../_models/user-stat.model';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    UserPictureDirective,
    MatSelectModule,
    MatSliderModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent extends BaseComponent {
  readonly userNameForm = new FormGroup({
    userName: new FormControl('', Validators.required)
  });

  readonly passwordForm = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  readonly userSkillControl = new FormControl<Skill[]>([])

  readonly userNameSaveEnabled = signal(false);
  readonly passwordSaveEnabled = signal(false);
  readonly userSkills = signal<UserSkill[]>([]);
  readonly skills = signal<Skill[]>([]);
  readonly user = model<User>();
  readonly userId = model<string>();
  readonly userStats = model<UserStat>();
  readonly isOwnProfile = computed(() => {
    return this.accountService.getCurrentUser()?.id == this.userId();
  });

  readonly imageInput = viewChild<ElementRef>('imageInput');
  readonly accountService = inject(AccountService);

  private readonly _userPicture = viewChild(UserPictureDirective);
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);
  private readonly _skillService = inject(SkillService);

  constructor(private readonly _route: ActivatedRoute) {
    super();
    this.loadSkills();

    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.userId.set(this.getUserIdFromUrl());
        this.loadUser();
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.userNameForm.controls['userName'].valueChanges
      .subscribe(value => {
        const saveEnabled = value?.length! > 0
          && value?.toLowerCase() != this.user()?.userName.toLowerCase()
        this.userNameSaveEnabled.set(saveEnabled);
    });

    this.passwordForm.controls['password'].valueChanges
      .subscribe(value => this.passwordSaveEnabled.set(value?.length! > 0));
  }

  skillCompare(skill1: Skill, skill2: Skill) {
    return skill1.name === skill2.name;
  }

  getSkillLevel(skill: Skill) {
    return this.userSkills().find(us => us.skill.name == skill.name)?.skillLevel ?? 0;
  }

  onSliderChange(skill: Skill, value: string) {
    const userSkill: UserSkill = {
      skill: skill,
      skillLevel: Number(value)
    };
    this._userService.setUserSkill(userSkill)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._toastr.info("Skill updated");
        if(value === '0')
          this.loadUserSkills();
      });
  }

  triggerImageInput() {
    this.imageInput()?.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(!input.files || input.files.length == 0)
      return;

    const file = input.files[0];
    this.accountService.uploadCurrentUserProfilePicture(file)
      .pipe(takeUntil(this._destroy$))
      .subscribe(_ => {
        this._userPicture()?.setPicture();
        this._toastr.success('Your profile picture was updated successfully');
      });
  }

  onUserNameSave() {
    const model: AccountSettingsModel = {
      userName: this.userNameForm.controls['userName'].value!
    };

    this.accountService.updateAccountSettings(model)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: _ => {
          this.userNameSaveEnabled.set(false);
          this.loadUser();
          this._toastr.success("Username is saved successfully!");
        }
    });
  }

  onPasswordSave() {
    const model: AccountSettingsModel = {
      password: this.passwordForm.controls['password'].value!
    };

    this.accountService.updateAccountSettings(model).pipe(take(1))
      .subscribe({
        next: _ => {
          this.passwordForm.controls['password'].setValue('');
          this.passwordSaveEnabled.set(false);
          this._toastr.success("Password is saved successfully!");
        }
    });
  }

  private loadUser() {
    if(!this.userId())
      return;

    this.loadUserSkills();
    this.loadUserStats();

    this._userService.getUser(this.userId()!)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: user => {
          this.user.set(user);
        },
        error: _ => {
          this._router.navigateByUrl('');
        }
      });
  }

  private getUserIdFromUrl() {
    return this._route.snapshot.paramMap.get('id')!;
  }

  private loadSkills() {
    this._skillService.getSkills()
      .pipe(takeUntil(this._destroy$))
      .subscribe(skills => this.skills.set(skills));
  }

  private loadUserStats() {
    this._userService.getUserStats(this.userId()!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(stats => this.userStats.set(stats));
  }

  private loadUserSkills() {
    if(!this.userId())
      return;
    this._userService.getUserSkills(this.userId()!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(userSkills => {
        this.userSkills.set(userSkills);
        this.userSkillControl.setValue(userSkills.map(s => s.skill));
      });
  }
}
