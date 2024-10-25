import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Skill } from '../_models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseService {
  getSkills() {
    return this.http.get<Skill[]>(this.apiUrl + 'skill');
  }
}
