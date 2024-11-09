import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Sprint } from '../_models/sprint.model';
import { Story } from '../_models/story.model';
import { SprintBurndownData as SprintBurndownData } from '../_models/reports/sprint-burndown-data.model';
import { SprintBacklogUpdateItem } from '../_models/sprint-backlog-update-item.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService extends BaseService {

  getSprint(sprintId: string) {
    return this.http.get<Sprint>(this.apiUrl + 'sprint/' + sprintId);
  }

  updateSprint(sprint: Sprint) {
    return this.http.patch(this.apiUrl + 'sprint/update', sprint, {responseType: 'text'});
  }

  updateBacklog(sprintId: string, updateItems: SprintBacklogUpdateItem[]) {
    return this.http.patch(this.apiUrl + 'sprint/update-backlog/' + sprintId, updateItems, {responseType: 'text'});
  }

  closeSprint(sprintId: string) {
    return this.http.get(this.apiUrl + 'sprint/close/' + sprintId, {responseType: 'text'});
  }

  getBurndownDatas(sprintId: string) {
    return this.http.get<SprintBurndownData[]>(this.apiUrl + 'sprint/reports/burndown/' + sprintId);
  }
}
