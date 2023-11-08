import {Directive, ElementRef, OnChanges, Injectable, Inject, SimpleChanges} from '@angular/core';
import {
  BaseDirective,
  StyleGenerator,
  StyleDefinition,
  StyleUtilsService,
  MediaMarshaller,
  LAYOUT_CONFIG,
  LayoutConfigOptions,
} from 'ri-flex-layout/src/lib/core';

import {buildLayoutCSS} from 'ri-flex-layout/src/lib/_private-utils';

export interface LayoutStyleDisplay {
  readonly display: string;
}

@Injectable({providedIn: 'root'})
export class LayoutStyleBuilder extends StyleGenerator {
  buildStyles(input: string, {display}: LayoutStyleDisplay) {
    const css = buildLayoutCSS(input);
    return {
      ...css,
      display: display === 'none' ? display : css.display,
    };
  }
}

const inputs = [
  'riFxLayout', 'riFxLayout.xs', 'riFxLayout.sm', 'riFxLayout.md',
  'riFxLayout.lg', 'riFxLayout.xl', 'riFxLayout.lt-sm', 'riFxLayout.lt-md',
  'riFxLayout.lt-lg', 'riFxLayout.lt-xl', 'riFxLayout.gt-xs', 'riFxLayout.gt-sm',
  'riFxLayout.gt-md', 'riFxLayout.gt-lg'
];
const selector = `
  [riFxLayout], [riFxLayout.xs], [riFxLayout.sm], [riFxLayout.md],
  [riFxLayout.lg], [riFxLayout.xl], [riFxLayout.lt-sm], [riFxLayout.lt-md],
  [riFxLayout.lt-lg], [riFxLayout.lt-xl], [riFxLayout.gt-xs], [riFxLayout.gt-sm],
  [riFxLayout.gt-md], [riFxLayout.gt-lg]
`;


@Directive()
export class LayoutDirective extends BaseDirective implements OnChanges {

  protected override RI_DIRECTIVE_KEY = 'layout';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtilsService,
              styleBuilder: LayoutStyleBuilder,
              marshal: MediaMarshaller,
              @Inject(LAYOUT_CONFIG) private _config: LayoutConfigOptions) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected override updateWithValue(input: string) {
    const detectLayoutDisplay = this._config.detectLayoutDisplay;
    const display = detectLayoutDisplay ? this.styler.lookupStyle(this.nativeElement, 'display') : '';
    this.styleCache = cacheMap.get(display) ?? new Map();
    cacheMap.set(display, this.styleCache);

    if (this.currentValue !== input) {
      this.addStyles(input, {display});
      this.currentValue = input;
    }
  }
}

@Directive({selector, inputs})
export class RIDefaultLayoutDirective extends LayoutDirective {
  protected override inputs = inputs;
}

type CacheMap = Map<string, StyleDefinition>;
const cacheMap = new Map<string, CacheMap>();
