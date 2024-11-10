import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Team } from '../_models/team.model';
import { User } from '../_models/user.model';
import { Project } from '../_models/project.model';
import { ChartData } from '../_models/reports/chart-data.model';

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
    return this.http.delete(this.apiUrl + 'teams/delete/' + id, {responseType: 'text'});
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

  getVelocityChartData(id: string) {
    return this.http.get<ChartData[]>(this.apiUrl + 'teams/velocity-chart/' + id);
  }
}
