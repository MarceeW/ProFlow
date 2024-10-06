import { computed, Injectable, signal } from '@angular/core';
import { NavigationEnd, ResolveEnd, Router } from '@angular/router';
import { SidenavItem } from '../_models/sidenav-item.model';

@Injectable({
  providedIn: 'root'
})
export class SidenavItemService {
  readonly items = computed(() => Object.values(this._items()));
  private readonly _items = signal<{[key: string]: SidenavItem}>({});

  constructor(private readonly router: Router) {
    this.router.events.subscribe(event => {
      if(!(event instanceof NavigationEnd))
        return;
      const item = Object.values(this._items())
        .find(item => event.url.includes(item.routerLink));

      if(item)
        return;
      this._items.set({});
      return;
    });
  }

  setItems(items: {[key: string]: SidenavItem}) {
    this._items.set(items);
  }
}
