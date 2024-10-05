import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidenavItem } from '../_models/sidenav-item.model';

@Injectable({
  providedIn: 'root'
})
export class SidenavItemService {
  private readonly _items = signal<SidenavItem[]>([]);

  constructor(private readonly router: Router) {
    this.router.events.subscribe(event => {
      if(!(event instanceof NavigationEnd))
        return;
      this._items.set([]);
    });
  }

  get items(): SidenavItem[] {
    return this._items();
  }

  setItems(items: SidenavItem[]) {
    this._items.set(items);
  }

  addItems(items: SidenavItem[]) {
    this._items.update(_items => [..._items, ...items]);
  }
}
