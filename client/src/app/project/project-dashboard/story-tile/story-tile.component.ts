import { Component, inject, input, output } from '@angular/core';
import { Story } from '../../../_models/story.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { UserPictureDirective } from '../../../_directives/user-picture.directive';

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
}
