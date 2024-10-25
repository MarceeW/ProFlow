import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';
import { Sprint } from '../_models/sprint.model';
import { Story } from '../_models/story.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {

  createProject(project: Project) {
    return this.http.post(this.apiUrl + 'project/create', project);
  }

  getProjects() {
    return this.http.get<Project[]>(this.apiUrl + 'project');
  }

  getProjectTeams(projectId: string) {
    return this.http.get<Team[]>(this.apiUrl + 'project/teams/' + projectId);
  }

  getMyProjects() {
    return this.http.get<Project[]>(this.apiUrl + 'project/my-projects');
  }

  getTeamleaderInProjects() {
    return this.http.get<Project[]>(this.apiUrl + 'project/teamleader-in');
  }

  getProject(projectId: string) {
    return this.http.get<Project>(this.apiUrl + 'project/' + projectId);
  }

  getNthSprint(projectId: string, n: number) {
    return this.http.get<Sprint>(this.apiUrl + 'project/nth-sprint/' + projectId, {
      params: new HttpParams().set('n', n)
    });
  }

  getSprints(projectId: string) {
    return this.http.get<Sprint[]>(this.apiUrl + 'project/sprints/' + projectId);
  }

  getBacklog(projectId: string) {
    return this.http.get<Story[]>(this.apiUrl + 'project/backlog/' + projectId);
  }

  addSprint(projectId: string, sprint: Sprint) {
    return this.http.post(this.apiUrl + 'project/add-sprint/' + projectId, sprint,
      {responseType: 'text'});
  }

  addStory(projectId: string, story: Story) {
    return this.http.post(this.apiUrl + 'project/add-story/' + projectId, story,
      {responseType: 'text'}
    );
  }

  deleteProject(projectId: string) {
    return this.http.delete(this.apiUrl + 'project/' + projectId);
  }

  removeStory(storyId: string) {
    return this.http.delete(this.apiUrl + 'project/remove-story/' + storyId);
  }
}
