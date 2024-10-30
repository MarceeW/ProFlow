import { Pipe, PipeTransform } from '@angular/core';
import { StoryStatus } from '../_enums/story-status.enum';

@Pipe({
  name: 'scrumState',
  standalone: true
})
export class ScrumStatePipe implements PipeTransform {

  transform(value: StoryStatus): string {
    const scrumStates = ['Backlog', 'In progress', 'Code review', 'Done']
    return scrumStates[value];
  }
}
