import { InjectionToken } from "@angular/core";

export const BASE_COMPONENT_SETUPloading =
  new InjectionToken<boolean>('BaseComponentSetupLoading', {
    providedIn: 'root',
    factory: () => true
  })
