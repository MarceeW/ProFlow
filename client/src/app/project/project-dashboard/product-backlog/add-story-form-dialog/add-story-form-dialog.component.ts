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
    MatSelectModule
  ],
  templateUrl: './add-story-form-dialog.component.html',
  styleUrl: './add-story-form-dialog.component.scss'
})
export class AddStoryFormDialog extends BaseComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddStoryFormDialog>);
  readonly formBuilder = inject(FormBuilder);
  readonly storyFormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    storyPriority: ['', Validators.required],
    storyType: ['', Validators.required],
    storyPoints: ['0', Validators.required],
    storyStatus: [StoryStatus.Backlog]
  });
  readonly storyPriorities = signal<string[]>([]);
  readonly storyTypes = signal<string[]>([]);

  private readonly _enumService = inject(EnumService);

  ngOnInit(): void {
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

  getFormValue() {
    return this.storyFormGroup.value as unknown as Story;
  }
}
