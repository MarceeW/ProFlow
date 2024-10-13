import { Component, inject, OnInit } from "@angular/core";
import { SidenavItem } from "../_models/sidenav-item.model";
import { SidenavItemService } from "../_services/sidenav-item.service";
import { BaseComponent } from "./base.component";

@Component({
  template: ''
})
export abstract class HasSideNav extends BaseComponent implements OnInit {

  abstract itemKey: string;
  protected readonly _sidenavItemService = inject(SidenavItemService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.setSidenavItems();
  }

  setSidenavItems() {
    const items = this.getSidenavItems();
    items[this.itemKey].activated = true;
    this._sidenavItemService.setItems(items);
  }

  abstract getSidenavItems(): {[key: string]: SidenavItem};
}
