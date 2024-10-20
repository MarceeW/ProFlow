import { DatePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../_component-base/base.component';
import { UserPictureDirective } from '../../../../_directives/user-picture.directive';
import { StoryCommit } from '../../../../_models/story-commit.model';
import { Story } from '../../../../_models/story.model';
import { AccountService } from '../../../../_services/account.service';
import { EnumService } from '../../../../_services/enum.service';
import { StoryService } from '../../../../_services/story.service';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_DIALOG_CONFIG } from '../../../../injection-tokens.config';

@Component({
  selector: 'app-story-commit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    UserPictureDirective,
    DatePipe
  ],
  templateUrl: './story-commit.component.html',
  styleUrl: './story-commit.component.scss',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_DIALOG_CONFIG
    }
  ]
})
export class StoryCommitComponent extends BaseComponent {
  readonly story = input.required<Story>();
  readonly commits = signal<StoryCommit[]>([]);
  readonly commitTypes = signal<string[]>([]);

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _accountService = inject(AccountService);
  private readonly _enumService = inject(EnumService);

  readonly commitFormGroup = this._formBuilder.group({
    commiter: [this._accountService.getCurrentUser()],
    storyCommitType: ['', Validators.required],
    summary: ['', Validators.required],
    hours: [1, Validators.required]
  });

  private readonly _storyService = inject(StoryService);

  override ngOnInit(): void {
    super.ngOnInit();

    this.loadCommits();
    this._enumService.getEnumValues('StoryCommitType')
      .pipe(takeUntil(this._destroy$))
      .subscribe(commitTypes => this.commitTypes.set(commitTypes));
  }

  canDeleteCommit(commit: StoryCommit) {
    return this._accountService.getCurrentUser()?.id === commit.commiter.id;
  }

  deleteCommit(commit: StoryCommit) {
    this._storyService.removeCommit(commit.id!)
    .pipe(takeUntil(this._destroy$))
    .subscribe(_ => {
      this._toastr.info('Commit deleted');
      this.loadCommits();
    });
  }

  addCommit() {
    const commit = this.commitFormGroup.value as StoryCommit;
    this.commitFormGroup.reset();
    this._storyService.addCommit(this.story().id!, commit)
    .pipe(takeUntil(this._destroy$))
    .subscribe(_ => {
      this._toastr.success('Commit added');
      this.loadCommits();
    });
  }

  private loadCommits() {
    this.loading.set(true);
    this._storyService.getCommits(this.story().id!)
    .pipe(takeUntil(this._destroy$))
    .subscribe(commits => {
      this.commits.set(commits);
      this.loading.set(false);
    });
  }
}
