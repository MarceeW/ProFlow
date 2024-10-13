import { InjectionToken } from "@angular/core";

export const BASE_COMPONENT_SETUP_LOADING =
  new InjectionToken<boolean>('BaseComponentSetupLoading', {
    providedIn: 'root',
    factory: () => true
  })
