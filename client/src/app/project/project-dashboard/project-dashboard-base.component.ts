import { Component, OnInit } from "@angular/core";
import { HasSideNav } from "../../_component-base/has-sidenav.component";
import { SidenavItem } from "../../_models/sidenav-item.model";

@Component({
  template: ''
})
export abstract class ProjectDashBoardBase extends HasSideNav {

  projectId!: string;

  constructor() {
    super();
    this.projectId = this.route.snapshot.paramMap.get('id')!;
  }

  getSidenavItems(): {[key: string]: SidenavItem} {
    const prefix = '/projects/project-dashboard/';
    const items: {[key: string]: SidenavItem} = {
      dashboard: {
        label: 'Dashboard',
        routerLink: prefix + this.projectId,
        icon: 'dashboard'
      },
      backlog: {
        label: 'Backlog',
        routerLink: prefix + 'backlog/' + this.projectId,
        icon: 'task'
      },
      timeline: {
        label: 'Timeline',
        routerLink: prefix + 'timeline/' + this.projectId,
        icon: 'timeline'
      },
      reports: {
        label: 'Reports',
        routerLink: prefix + 'reports/' + this.projectId,
        icon: 'flag'
      },
      settings: {
        label: 'Settings',
        routerLink: prefix + 'settings/' + this.projectId,
        icon: 'settings'
      }
    };
    return items;
  }
}
