import { Component, inject, input } from '@angular/core';
import { Story } from '../../../_models/story.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';

@Component({
  selector: 'app-story-tile',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './story-tile.component.html',
  styleUrl: './story-tile.component.scss'
})
export class StoryTileComponent {
  readonly story = input.required<Story>();
  readonly disabled = input<boolean>(false);
  private readonly _dialog = inject(MatDialog);

  openStoryDialog() {
    this._dialog.open(StoryDialogComponent, {
      width: '500px',
      data: this.story()
    });
  }
}
