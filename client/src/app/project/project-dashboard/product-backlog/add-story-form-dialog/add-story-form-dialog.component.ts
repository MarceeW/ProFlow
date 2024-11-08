import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StoryStatus } from '../../../../_enums/story-status.enum';
import { EnumService } from '../../../../_services/enum.service';
import { BaseComponent } from '../../../../_component-base/base.component';
import { takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { Story } from '../../../../_models/story.model';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_DIALOG_CONFIG } from '../../../../injection-tokens.config';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-story-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './add-story-form-dialog.component.html',
  styleUrl: './add-story-form-dialog.component.scss',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_DIALOG_CONFIG
    }
  ]
})
export class AddStoryFormDialog extends BaseComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddStoryFormDialog>);
  readonly formBuilder = inject(FormBuilder);
  readonly tags = signal<string[]>([]);
  readonly storyFormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    storyPriority: ['', Validators.required],
    storyType: ['', Validators.required],
    storyPoints: [undefined],
    storyStatus: [StoryStatus.Backlog],
    tags: [[]]
  });
  readonly storyPriorities = signal<string[]>([]);
  readonly storyTypes = signal<string[]>([]);

  private readonly _enumService = inject(EnumService);

  override ngOnInit(): void {
    super.ngOnInit();
    this._enumService.getEnumValues('StoryPriority')
      .pipe(takeUntil(this._destroy$))
      .subscribe(priorities => {
        this.storyPriorities.set(priorities);
      });

    this._enumService.getEnumValues('StoryType')
      .pipe(takeUntil(this._destroy$))
      .subscribe(types => {
        this.storyTypes.set(types);
      });
  }

  removeTag(tag: string) {
    this.tags.update(tags => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      return [...tags];
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.update(tags => [...tags, value]);
    }

    event.chipInput!.clear();
  }

  getFormValue() {
    return this.storyFormGroup.value as unknown as Story;
  }
}
