import { InjectionToken } from "@angular/core";

export interface LayoutConfigOptions {
    addFlexToParent?: boolean;
    addOrientationBps?: boolean;
    disableDefaultBps?: boolean;
    disableVendorPrefixes?: boolean;
    serverLoaded?: boolean;
    useColumnBasisZero?: boolean;
    printWithBreakpoints?: string[];
    mediaTriggerAutoRestore?: boolean;
    ssrObserveBreakpoints?: string[];
    multiplier?: Multiplier;
    defaultUnit?: string;
    detectLayoutDisplay?: boolean;
  }
  
  export const DEFAULT_CONFIG: Required<LayoutConfigOptions> = {
    addFlexToParent: true,
    addOrientationBps: false,
    disableDefaultBps: false,
    disableVendorPrefixes: false,
    serverLoaded: false,
    useColumnBasisZero: true,
    printWithBreakpoints: [],
    mediaTriggerAutoRestore: true,
    ssrObserveBreakpoints: [],

    multiplier: undefined as unknown as Multiplier,
    defaultUnit: 'px',
    detectLayoutDisplay: false,
  };
  
  export const LAYOUT_CONFIG = new InjectionToken<LayoutConfigOptions>(
      'Flex Layout token, config options for the library', {
        providedIn: 'root',
        factory: () => DEFAULT_CONFIG
      });
  
      export interface Multiplier {
        readonly unit: string;
        readonly value: number;
      }
      
      const MULTIPLIER_SUFFIX = 'x';
      
      export function multiply(value: string, multiplier?: Multiplier): string {
        if (multiplier === undefined) {
          return value;
        }
      
        const transformValue = (possibleValue: string) => {
          const numberValue = +(possibleValue.slice(0, -MULTIPLIER_SUFFIX.length));
      
          if (value.endsWith(MULTIPLIER_SUFFIX) && !isNaN(numberValue)) {
            return `${numberValue * multiplier.value}${multiplier.unit}`;
          }
      
          return value;
        };
      
        return value.includes(' ') ?
          value.split(' ').map(transformValue).join(' ') : transformValue(value);
      }
          