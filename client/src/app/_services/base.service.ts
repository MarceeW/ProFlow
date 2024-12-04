import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService implements OnDestroy {
  protected apiUrl: string = environment.apiUrl;
  protected readonly _destroy$ = new Subject<void>();

  constructor(
    protected http: HttpClient,
    protected router: Router) { }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
