import { Component, computed, effect, inject, OnDestroy, signal, untracked, viewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs";
import { HasSideNav } from "../../_component-base/has-sidenav.component";
import { Project, ProjectTeam } from "../../_models/project.model";
import { SidenavItem } from "../../_models/sidenav-item.model";
import { Sprint } from "../../_models/sprint.model";
import { Story } from "../../_models/story.model";
import { AccountService } from "../../_services/account.service";
import { ProjectService } from "../../_services/project.service";
import { TeamSelectorComponent } from "./team-selector/team-selector.component";

@Component({
  template: ''
})
export abstract class ProjectBaseComponent extends HasSideNav implements OnDestroy {

  projectId!: string;
  readonly project = signal<Project | null>(null);
  readonly team = signal<ProjectTeam | undefined | null>(undefined);

  readonly teamSprints = computed<Sprint[]>(() => {
    return this.project()?.sprints?.filter(s => s.teamId == this.team()?.id) ?? [];
  });

  protected override _loadSidenavItemsOnInit = false;
  protected readonly _teamSelector = viewChild(TeamSelectorComponent);
  protected readonly _route = inject(ActivatedRoute);
  protected readonly _projectService = inject(ProjectService);
  protected readonly _authService = inject(AccountService);

  private readonly _router = inject(Router);

  override ngOnInit(): void {
    this.projectId = this._route.snapshot.paramMap.get('id')!;
    this.loadProject();
    super.ngOnInit();
  }

  isTeamsEmpty() {
    return this.project()?.teams.length == 0;
  }

  onTeamSelectionChanged(team: ProjectTeam) {
    this.team.set(team);
  }

  teamSelectionVisible() {
    return this.isUserProjectManager() || this.isUserTeamLeader();
  }

  loadProject() {
    this._projectService.getProject(this.projectId)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: project => {
        this.onProjectLoaded(project);
        this.setSidenavItems();
      },
      error: _ => {
        this._router.navigateByUrl('');
      }
    });
  }

  private setTeam() {
    const userId = this._authService.getCurrentUser()!.id;
    const team = this.isUserProjectManager() ? this._teamSelector()?.value :
      this.project()?.teams.find(t => t.memberIds.find(m => m === userId));
    this.team.set(team);
  }

  loadBacklog() {
    this._projectService.getBacklog(this.projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(stories => {
        this.onBacklogLoaded(stories);
      });
  }

  onBacklogLoaded(stories: Story[]) {}

  onProjectLoaded(project: Project) {
    this.project.set(project);
    this.setTeam();
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
        enabled: this.isUserProjectManager()
      },
      managesprints: {
        label: 'Manage sprint',
        routerLink: prefix + 'manage-sprints/' + this.projectId,
        icon: 'run_circle',
        enabled: this.isUserProjectManager() || this.isUserTeamLeader()
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
        icon: 'settings',
        enabled: this.isUserProjectManager()
      }
    };
    return items;
  }

  isProjectHasSprints() {
    return (this.project()?.sprints ?? []).length > 0;
  }

  protected onSprintLoaded(sprint?: Sprint): void {}

  protected loadNthSprint(n: number) {
    if(!this.isProjectHasSprints())
      return;

    this._projectService.getNthSprint(this.projectId, this.team()!.id, n)
      .pipe(takeUntil(this._destroy$))
      .subscribe(sprint => {
        this.onSprintLoaded(sprint);
      });
  }

  protected isUserProjectManager() {
    const authUser = this._authService.getCurrentAuthUser();
    if(!authUser || !this.project())
      return false;
    return this.project()!.projectManager.id === authUser.id;
  }

  protected isUserTeamLeader() {
    const authUser = this._authService.getCurrentAuthUser();
    if(!authUser || !this.project())
      return false;
    return !!this.project()!.teamLeaders.find(t => t.id === authUser.id);
  }
}
