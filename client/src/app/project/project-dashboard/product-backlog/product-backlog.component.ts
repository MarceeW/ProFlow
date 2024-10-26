import { Component, inject, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntil } from 'rxjs';
import { Story } from '../../../_models/story.model';
import { ProjectBaseComponent } from '../project-base.component';
import { AddStoryFormDialog } from './add-story-form-dialog/add-story-form-dialog.component';
import { BacklogTableComponent } from './backlog-table/backlog-table.component';

@Component({
  selector: 'app-product-backlog',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    BacklogTableComponent
  ],
  templateUrl: './product-backlog.component.html',
  styleUrl: './product-backlog.component.scss'
})
export class ProductBacklogComponent extends ProjectBaseComponent {
  override itemKey: string = 'productbacklog';

  protected override _title = 'Product backlog';
  private readonly _dialog = inject(MatDialog);
  private readonly _backlogTable = viewChild(BacklogTableComponent);

  openCreateStoryDialog() {
    const dialogRef = this._dialog.open(AddStoryFormDialog, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: Story) => {
      if(!result)
        return;
      this._projectService.addStory(this.projectId, result)
        .pipe(takeUntil(this._destroy$))
        .subscribe(response => {
          this._toastr.success(response);
          this._backlogTable()?.loadBacklog();
        });
    });
  }
}
