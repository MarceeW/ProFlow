import { InjectionToken } from "@angular/core";

export interface BaseComponentConfig {
  setupLoading: boolean,
  setupTitle: boolean
}

export const BASE_COMPONENT_DEFAULT_CONFIG =
  new InjectionToken<BaseComponentConfig>('BaseComponentDefaultConfig', {
    providedIn: 'root',
    factory: () => {
      const config: BaseComponentConfig = {
        setupLoading: true,
        setupTitle: true
      };
      return config;
    }
  });

export const BASE_COMPONENT_DIALOG_CONFIG =
  new InjectionToken<BaseComponentConfig>('BaseComponentDialogConfig', {
    providedIn: 'root',
    factory: () => {
      const config: BaseComponentConfig = {
        setupLoading: false,
        setupTitle: false
      };
      return config;
    }
  });
