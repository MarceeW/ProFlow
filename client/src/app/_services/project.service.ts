import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Project } from '../_models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {

  createProject(project: Project) {
    return this.http.post(this.apiUrl + 'project/create', project);
  }
}
