import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Team } from '../_models/team';
import { User } from '../_models/user';
import { Project } from '../_models/project';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseService {

  getTeams() {
    return this.http.get<Team[]>(this.apiUrl + 'teams');
  }

  getMyTeams() {
    return this.http.get<Team[]>(this.apiUrl + 'teams/my-teams');
  }

  getTeam(id: string) {
    return this.http.get<Team>(this.apiUrl + 'teams/' + id);
  }

  createTeam(team: Team) {
    return this.http.post(this.apiUrl + 'teams/create', team);
  }

  deleteTeam(id: string) {
    return this.http.delete<Team[]>(this.apiUrl + 'teams/delete' + id);
  }

  addMembers(id: string, members: User[]) {
    return this.http.patch(this.apiUrl + 'teams/add-to-team/' + id, members);
  }

  removeMembers(id: string, members: User[]) {
    return this.http.patch(this.apiUrl + 'teams/remove-from-team/' + id, members);
  }

  addToProject(id: string, projects: Project[]) {
    return this.http.patch(this.apiUrl + 'teams/add-to-project/' + id, projects);
  }

  removeProjects(id: string, projects: Project[]) {
    return this.http.patch(this.apiUrl + 'teams/remove-from-project/' + id, projects);
  }
}