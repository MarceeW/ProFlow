import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EnumService extends BaseService {

  getEnumValues(enumName: string) {
    return this.http.get<string[]>(this.apiUrl + 'enumvalue/' + enumName);
  }
}
