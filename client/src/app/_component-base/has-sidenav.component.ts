import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SidenavItem } from "../_models/sidenav-item.model";
import { SidenavItemService } from "../_services/sidenav-item.service";

@Component({
  template: ''
})
export abstract class HasSideNav implements OnInit {

  abstract itemKey: string;
  readonly route = inject(ActivatedRoute);
  protected readonly _sidenavItemService = inject(SidenavItemService);

  ngOnInit(): void {
    const items = this.getSidenavItems();
    items[this.itemKey].activated = true;
    this._sidenavItemService.setItems(items);
  }

  abstract getSidenavItems(): {[key: string]: SidenavItem};
}
