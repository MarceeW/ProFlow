import { Component, effect, inject, OnDestroy, OnInit, signal, untracked } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { ComponentArgsService } from "../_services/component-args.service";
import { BASE_COMPONENT_DEFAULT_CONFIG } from "../injection-tokens.config";

@Component({
  template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  readonly title = signal<string | undefined>(undefined);
  readonly argsService = inject(ComponentArgsService);

  protected _title?: string;
  protected _clipIntoContainer = true;
  protected _showNavBar = true;

  protected readonly _destroy$ = new Subject<void>();
  protected readonly _toastr = inject(ToastrService);

  private readonly defaultConfig = inject(BASE_COMPONENT_DEFAULT_CONFIG);

  constructor() {
    this.argsService.loadingSpinnerDisabled
      .set(this.defaultConfig.setupLoading);

    if(this.defaultConfig.setupTitle) {
      effect(() => {
        this.title();
        untracked(() => this.argsService.title.set(this.title()));
      });
    }
  }

  ngOnInit(): void {
    if(this._title)
      this.title.set(this._title);
    this.argsService.clipIntoContainer.set(this._clipIntoContainer);
    this.argsService.showNavBar.set(this._showNavBar);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    if(this.defaultConfig.setupTitle)
      this.argsService.title.set(undefined);
    this.argsService.clipIntoContainer.set(true);
    this.argsService.showNavBar.set(true);
  }
}
