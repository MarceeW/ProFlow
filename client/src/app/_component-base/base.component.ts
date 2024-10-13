import { Component, effect, inject, OnDestroy, signal, untracked } from "@angular/core";
import { Subject } from "rxjs";
import { ComponentLoadStatusService } from "../_services/component-load-status.service";
import { ToastrModule, ToastrService } from "ngx-toastr";

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  readonly _loading = signal<boolean>(false);
  protected readonly _destroy$ = new Subject<void>();
  protected readonly _toastr = inject(ToastrService);
  private readonly _loadService = inject(ComponentLoadStatusService);

  constructor() {
    effect(() => {
      this._loading();
      untracked(() => this._loadService.loading.set(this._loading()));
    })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}