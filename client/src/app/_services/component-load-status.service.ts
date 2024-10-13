import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoadStatusService {
  readonly loading = signal<boolean>(false);
}
