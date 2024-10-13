import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Sprint } from '../_models/sprint.model';
import { Story } from '../_models/story.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService extends BaseService {

  getSprint(sprintId: string) {
    return this.http.get<Sprint>(this.apiUrl + 'sprint/' + sprintId);
  }

  addStories(sprintId: string, stories: Story[]) {
    return this.http.patch(this.apiUrl + 'sprint/add-stories/' + sprintId, stories);
  }

  removeStories(sprintId: string, stories: Story[]) {
    return this.http.patch(this.apiUrl + 'sprint/remove-stories/' + sprintId, stories);
  }

  closeSprint(sprintId: string) {
    return this.http.get(this.apiUrl + 'sprint/close/' + sprintId, {responseType: 'text'});
  }
}
