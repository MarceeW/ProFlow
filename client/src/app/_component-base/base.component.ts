import { Component, effect, inject, OnDestroy, OnInit, signal, untracked } from "@angular/core";
import { Subject } from "rxjs";
import { ComponentArgsService } from "../_services/component-args.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BASE_COMPONENT_DEFAULT_CONFIG } from "../injection-tokens.config";

@Component({
  template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  readonly loading = signal<boolean>(false);
  readonly title = signal<string | undefined>(undefined);

  protected _title?: string;
  protected readonly _destroy$ = new Subject<void>();
  protected readonly _toastr = inject(ToastrService);
  private readonly _componentArgsService = inject(ComponentArgsService);
  private readonly defaultConfig = inject(BASE_COMPONENT_DEFAULT_CONFIG);

  constructor() {
    if(this.defaultConfig.setupLoading) {
      effect(() => {
        this.loading();
        untracked(() => this._componentArgsService.loading.set(this.loading()));
      });
    }

    if(this.defaultConfig.setupTitle) {
      effect(() => {
        this.title();
        untracked(() => this._componentArgsService.title.set(this.title()));
      });
    }
  }

  ngOnInit(): void {
    if(this._title)
      this.title.set(this._title);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._componentArgsService.title.set(undefined);
  }
}
