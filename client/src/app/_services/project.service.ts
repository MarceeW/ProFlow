import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project } from '../_models/project.model';
import { Team } from '../_models/team.model';

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

  getProjectTeams(id: string) {
    return this.http.get<Team[]>(this.apiUrl + 'project/teams/' + id);
  }

  getMyProjects() {
    return this.http.get<Project[]>(this.apiUrl + 'project/my-projects');
  }

  getProject(id: string) {
    return this.http.get<Project>(this.apiUrl + 'project/' + id);
  }
}
