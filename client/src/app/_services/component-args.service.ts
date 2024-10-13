import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentArgsService {
  readonly loading = signal<boolean>(false);
  readonly title = signal<string | undefined>(undefined);
}
