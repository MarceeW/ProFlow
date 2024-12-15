import { Component, inject, input, output } from '@angular/core';
import { Story } from '../../../_models/story.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { UserPictureDirective } from '../../../_directives/user-picture.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-story-tile',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    UserPictureDirective
  ],
  templateUrl: './story-tile.component.html',
  styleUrl: './story-tile.component.scss'
})
export class StoryTileComponent {
  readonly story = input.required<Story>();
  readonly disabled = input<boolean>(false);

  readonly storyChanged = output();

  private readonly _dialog = inject(MatDialog);

  openStoryDialog() {
    const dialogRef = this._dialog.open(StoryDialogComponent, {
      minWidth: 600,
      data: this.story()
    });

    dialogRef.afterClosed().subscribe(storyChanged => {
      if(storyChanged)
        this.storyChanged.emit();
    })
  }

  getFormatteMatchRate(matchRate: number) {
    return `${Math.round(matchRate * 100)}%`;
  }

  getColorByMatchRate(matchRate: number): string {
    if (matchRate < 0.2)
      return "#FF0000";

    if (matchRate >= 0.2 && matchRate <= 0.7)
      return "#FFA500";

    return "#008000";
  }
}
