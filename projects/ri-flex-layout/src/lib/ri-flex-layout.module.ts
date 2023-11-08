import { ModuleWithProviders, NgModule } from '@angular/core';
import { RiFlexLayoutComponent } from './ri-flex-layout.component';
import { LayoutConfigOptions, BreakPoint, LAYOUT_CONFIG, DEFAULT_CONFIG, BREAKPOINT, SERVER_TOKEN } from 'ri-flex-layout/src/lib/core';
import { FlexModule } from 'ri-flex-layout/src/lib/flex';
import { RIExtendedModule } from 'ri-flex-layout/src/lib/extended';



@NgModule({
  declarations: [
    RiFlexLayoutComponent
  ],
  imports: [
    FlexModule, RIExtendedModule
  ],
  exports: [
    FlexModule, RIExtendedModule
  ]
})
export class RiFlexLayoutModule {
  static withConfig(
    configOptions: LayoutConfigOptions,
    breakpoints: BreakPoint | BreakPoint[] = []
  ): ModuleWithProviders<RiFlexLayoutModule> {
    return {
      ngModule: RiFlexLayoutModule,
      providers: configOptions.serverLoaded
        ? [
            {
              provide: LAYOUT_CONFIG,
              useValue: { ...DEFAULT_CONFIG, ...configOptions },
            },
            { provide: BREAKPOINT, useValue: breakpoints, multi: true },
            { provide: SERVER_TOKEN, useValue: true },
          ]
        : [
            {
              provide: LAYOUT_CONFIG,
              useValue: { ...DEFAULT_CONFIG, ...configOptions },
            },
            { provide: BREAKPOINT, useValue: breakpoints, multi: true },
          ],
    };
}
 }
