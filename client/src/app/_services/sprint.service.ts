import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Sprint } from '../_models/sprint.model';
import { Story } from '../_models/story.model';
import { SprintBurndownData as SprintBurndownData } from '../_models/reports/sprint-burndown-data.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService extends BaseService {

  getSprint(sprintId: string) {
    return this.http.get<Sprint>(this.apiUrl + 'sprint/' + sprintId);
  }

  addStories(sprintId: string, stories: Story[]) {
    return this.http.patch(this.apiUrl + 'sprint/add-stories/' + sprintId, stories, {responseType: 'text'});
  }

  removeStories(sprintId: string, stories: Story[]) {
    return this.http.patch(this.apiUrl + 'sprint/remove-stories/' + sprintId, stories, {responseType: 'text'});
  }

  closeSprint(sprintId: string) {
    return this.http.get(this.apiUrl + 'sprint/close/' + sprintId, {responseType: 'text'});
  }

  getBurndownDatas(sprintId: string) {
    return this.http.get<SprintBurndownData[]>(this.apiUrl + 'sprint/reports/burndown/' + sprintId);
  }
}
