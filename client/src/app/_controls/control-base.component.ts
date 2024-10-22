import { booleanAttribute, Component, computed, effect, ElementRef, inject, input, OnDestroy, OnInit, signal, untracked } from "@angular/core";
import { ControlEvent, ControlValueAccessor, NgControl, TouchedChangeEvent, Validators } from "@angular/forms";
import { MAT_FORM_FIELD, MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { BaseComponent } from "../_component-base/base.component";
import { BASE_COMPONENT_CONTROL_CONFIG, BASE_COMPONENT_DEFAULT_CONFIG } from "../injection-tokens.config";

@Component({
  template: '',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_CONTROL_CONFIG
    }
  ]
})
export abstract class ControlBase<T> extends BaseComponent
  implements ControlValueAccessor, MatFormFieldControl<T>, OnDestroy, OnInit {

    abstract readonly id: string;
  abstract readonly controlType: string;
  autofilled?: boolean | undefined;
  disableAutomaticLabeling?: boolean | undefined;

  readonly stateChanges = new Subject<void>();
  readonly ngControl = inject(NgControl, { optional: true, self: true });

  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _userAriaDescribedBy = input<string>('', { alias: 'aria-describedby' });

  protected readonly _formField = inject(MAT_FORM_FIELD, { optional: true, });
  protected readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly _touched = signal(false);
  protected readonly _focused = signal(false);
  protected readonly _disabledByCva = signal(false);
  protected readonly _disabled = computed(() => this._disabledByInput() || this._disabledByCva());
  protected readonly _requiredByValidators = signal(false);

  onChange = (_: any) => {};
  onTouched = () => {};

  abstract get empty(): boolean;
  abstract get value(): T | null;

  get placeholder(): string {
    return this._placeholder();
  }

  get focused(): boolean {
    return this._focused();
  }

  get touched(): boolean {
    return this._touched();
  }

  get shouldLabelFloat(): boolean {
    return true;
  }

  get required(): boolean {
    return this._required() || this._requiredByValidators();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get errorState(): boolean {
    return this.empty && this.required && this.touched;
  }

  get userAriaDescribedBy(): string {
    return this._userAriaDescribedBy();
  }

  constructor() {
    super();

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      this._placeholder();
      this._required();
      this._disabled();
      this._focused();
      this._touched();

      untracked(() => this.stateChanges.next());
    });
  }

  abstract onContainerClick(event: MouseEvent): void;
  abstract writeValue(value: T): void;
  abstract setDescribedByIds(ids: string[]): void;

  override ngOnInit(): void {
    super.ngOnInit();

    const hasRequired = this.ngControl?.control?.hasValidator(Validators.required);
    if(hasRequired)
    this._requiredByValidators.set(hasRequired);

    this.ngControl?.control?.events.subscribe((event: ControlEvent) => {
      if(event instanceof TouchedChangeEvent) {
        this._touched.set(event.touched);
        this.onTouched();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }

  onFocusIn(): void {
    if (!this._focused()) {
        this._focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
    this._touched.set(true);
    this._focused.set(false);
    this.onTouched();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }
}
