import { Component, inject } from '@angular/core';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_DIALOG_CONFIG } from '../../../injection-tokens.config';
import { BaseComponent } from '../../../_component-base/base.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Story } from '../../../_models/story.model';

@Component({
  selector: 'app-story-dialog',
  standalone: true,
  imports: [],
  templateUrl: './story-dialog.component.html',
  styleUrl: './story-dialog.component.scss',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_DIALOG_CONFIG
    }
  ]
})
export class StoryDialogComponent extends BaseComponent {
  readonly dialogData: Story = inject(MAT_DIALOG_DATA);
}
