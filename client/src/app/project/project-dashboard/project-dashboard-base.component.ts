import { Component, inject, OnDestroy, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs";
import { HasSideNav } from "../../_component-base/has-sidenav.component";
import { Project } from "../../_models/project.model";
import { SidenavItem } from "../../_models/sidenav-item.model";
import { Sprint } from "../../_models/sprint.model";
import { AccountService } from "../../_services/account.service";
import { ProjectService } from "../../_services/project.service";

@Component({
  template: ''
})
export abstract class ProjectDashBoardBase extends HasSideNav implements OnDestroy {

  projectId!: string;
  readonly project = signal<Project | null>(null);

  protected override _loadSidenavItemsOnInit = false;
  protected readonly _route = inject(ActivatedRoute);
  protected readonly _projectService = inject(ProjectService);

  private readonly _authService = inject(AccountService);
  private readonly _router = inject(Router);

  override ngOnInit(): void {
    this.projectId = this._route.snapshot.paramMap.get('id')!;
    this.loadProject();
    super.ngOnInit();
  }

  loadProject() {
    this.loading.set(true);
    this._projectService.getProject(this.projectId)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: project => {
        this.onProjectLoaded(project);
        this.setSidenavItems();
        this.loading.set(false);
      },
      error: _ => {
        this.loading.set(false);
        this._router.navigateByUrl('');
      }
    });
  }

  onProjectLoaded(project: Project) {
    this.project.set(project);
  }

  override getSidenavItems(): {[key: string]: SidenavItem} {
    const prefix = '/projects/project-dashboard/';
    const items: {[key: string]: SidenavItem} = {
      dashboard: {
        label: 'Dashboard',
        routerLink: prefix + this.projectId,
        icon: 'dashboard'
      },
      scrumboard: {
        label: 'Scrum board',
        routerLink: prefix + 'scrum-board/' + this.projectId,
        icon: 'grid_view',

      },
      productbacklog: {
        label: 'Product backlog',
        routerLink: prefix + 'product-backlog/' + this.projectId,
        icon: 'task',
        enabled: this.isUserProjectOwner()
      },
      managesprints: {
        label: 'Manage sprints',
        routerLink: prefix + 'manage-sprints/' + this.projectId,
        icon: 'run_circle',
        enabled: this.isUserProjectOwner()
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

  isProjectHasSprints() {
    return (this.project()?.sprints ?? []).length > 0;
  }

  protected onSprintLoaded(sprint: Sprint): void {}

  protected loadNthSprint(n: number) {
    if(!this.isProjectHasSprints())
      return;

    this.loading.set(true);
    this._projectService.getNthSprint(this.projectId, n)
      .pipe(takeUntil(this._destroy$))
      .subscribe(sprint => {
        this.onSprintLoaded(sprint);
        this.loading.set(false);
      });
  }

  private isUserProjectOwner() {
    const authUser = this._authService.getCurrentUser();
    if(!authUser || !this.project())
      return false;

    return this.project()!.projectManager.id === authUser.id;
  }
}
