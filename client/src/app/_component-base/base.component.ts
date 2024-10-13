import { Component, effect, inject, OnDestroy, signal, untracked } from "@angular/core";
import { Subject } from "rxjs";
import { ComponentArgsService } from "../_services/component-args.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BASE_COMPONENT_SETUPloading } from "../injection-tokens.config";

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  readonly loading = signal<boolean>(false);
  protected readonly _destroy$ = new Subject<void>();
  protected readonly _toastr = inject(ToastrService);
  private readonly _loadService = inject(ComponentArgsService);
  private readonly setupLoading = inject(BASE_COMPONENT_SETUPloading);

  constructor() {
    if(!this.setupLoading)
      return;
    effect(() => {
      this.loading();
      untracked(() => this._loadService.loading.set(this.loading()));
    })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
