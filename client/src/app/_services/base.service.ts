import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl: string = environment.apiUrl;

  constructor(
    protected http: HttpClient,
    protected router: Router) { }
}
