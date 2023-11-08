import { AfterContentInit, Directive, ElementRef, Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { BaseDirective, ElementMatcher, LAYOUT_CONFIG, 
  LayoutConfigOptions, MediaMarshaller, StyleDefinition, StyleGenerator, StyleUtilsService,
   multiply } from 'ri-flex-layout/src/lib/core';
import { Directionality } from '@angular/cdk/bidi';
import { Subject, takeUntil } from 'rxjs';
import { LAYOUT_VALUES } from 'ri-flex-layout/src/lib/_private-utils';

export interface LayoutGapParent {
  directionality: string;
  items: HTMLElement[];
  layout: string;
}

const CLEAR_MARGIN_CSS = {
  'margin-left': null,
  'margin-right': null,
  'margin-top': null,
  'margin-bottom': null
};

@Injectable({providedIn: 'root'})
export class LayoutGapStyleBuilder extends StyleGenerator {
  constructor(private _styler: StyleUtilsService,
              @Inject(LAYOUT_CONFIG) private _config: LayoutConfigOptions) {
    super();
  }

  buildStyles(gapValue: string, parent: LayoutGapParent) {
    if (gapValue.endsWith(GRID_SPECIFIER)) {
      gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
      gapValue = multiply(gapValue, this._config.multiplier);

      return buildGridMargin(gapValue, parent.directionality);
    } else {
      return {};
    }
  }

  override sideEffect(gapValue: string, _styles: StyleDefinition, parent: LayoutGapParent) {
    const items = parent.items;
    if (gapValue.endsWith(GRID_SPECIFIER)) {
      gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
      gapValue = multiply(gapValue, this._config.multiplier);
      const paddingStyles = buildGridPadding(gapValue, parent.directionality);
      this._styler.applyStyleToElements(paddingStyles, parent.items);
    } else {
      gapValue = multiply(gapValue, this._config.multiplier);
      gapValue = this.addFallbackUnit(gapValue);

      const lastItem = items.pop()!;

      const gapCss = buildGapCSS(gapValue, parent);
      this._styler.applyStyleToElements(gapCss, items);

      this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [lastItem]);
    }
  }

  private addFallbackUnit(value: string) {
    return !isNaN(+value) ? `${value}${this._config.defaultUnit}` : value;
  }
}

const inputs = [
  'riFxLayoutGap', 'riFxLayoutGap.xs', 'riFxLayoutGap.sm', 'riFxLayoutGap.md',
  'riFxLayoutGap.lg', 'riFxLayoutGap.xl', 'riFxLayoutGap.lt-sm', 'riFxLayoutGap.lt-md',
  'riFxLayoutGap.lt-lg', 'riFxLayoutGap.lt-xl', 'riFxLayoutGap.gt-xs', 'riFxLayoutGap.gt-sm',
  'riFxLayoutGap.gt-md', 'riFxLayoutGap.gt-lg'
];
const selector = `
  [riFxLayoutGap], [riFxLayoutGap.xs], [riFxLayoutGap.sm], [riFxLayoutGap.md],
  [riFxLayoutGap.lg], [riFxLayoutGap.xl], [riFxLayoutGap.lt-sm], [riFxLayoutGap.lt-md],
  [riFxLayoutGap.lt-lg], [riFxLayoutGap.lt-xl], [riFxLayoutGap.gt-xs], [riFxLayoutGap.gt-sm],
  [riFxLayoutGap.gt-md], [riFxLayoutGap.gt-lg]
`;


@Directive()
export class LayoutGapDirective extends BaseDirective implements AfterContentInit, OnDestroy {
  protected layout = 'row';  // default flex-direction
  protected override RI_DIRECTIVE_KEY = 'layout-gap';
  protected observerSubject = new Subject<void>();

  protected get childrenNodes(): HTMLElement[] {
    const obj = this.nativeElement.children;
    const buffer: any[] = [];

    for (let i = obj.length; i--;) {
      buffer[i] = obj[i];
    }
    return buffer;
  }

  constructor(elRef: ElementRef,
              protected zone: NgZone,
              protected directionality: Directionality,
              protected styleUtils: StyleUtilsService,
              styleBuilder: LayoutGapStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    const extraTriggers = [this.directionality.change, this.observerSubject.asObservable()];
    this.init(extraTriggers);
    this.marshal
      .trackValue(this.nativeElement, 'layout')
      .pipe(takeUntil(this.destroySubject))
      .subscribe(this.onLayoutChange.bind(this));
  }

  ngAfterContentInit() {
    this.buildChildObservable();
    this.triggerUpdate();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  protected onLayoutChange(matcher: ElementMatcher) {
    const layout: string = matcher.value;
    const direction = layout.split(' ');
    this.layout = direction[0];
    if (!LAYOUT_VALUES.find(x => x === this.layout)) {
      this.layout = 'row';
    }
    this.triggerUpdate();
  }


  protected override updateWithValue(value: string) {
    const items = this.childrenNodes
      .filter(el => el.nodeType === 1 && this.willDisplay(el))
      .sort((a, b) => {
        const orderA = +this.styler.lookupStyle(a, 'order');
        const orderB = +this.styler.lookupStyle(b, 'order');
        if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
          return 0;
        } else {
          return orderA > orderB ? 1 : -1;
        }
      });

    if (items.length > 0) {
      const directionality = this.directionality.value;
      const layout = this.layout;
      if (layout === 'row' && directionality === 'rtl') {
        this.styleCache = layoutGapCacheRowRtl;
      } else if (layout === 'row' && directionality !== 'rtl') {
        this.styleCache = layoutGapCacheRowLtr;
      } else if (layout === 'column' && directionality === 'rtl') {
        this.styleCache = layoutGapCacheColumnRtl;
      } else if (layout === 'column' && directionality !== 'rtl') {
        this.styleCache = layoutGapCacheColumnLtr;
      }
      this.addStyles(value, {directionality, items, layout});
    }
  }

  protected override clearStyles() {
    const gridMode = Object.keys(this.mru).length > 0;
    const childrenStyle = gridMode ? 'padding' :
      getMarginType(this.directionality.value, this.layout);

    if (gridMode) {
      super.clearStyles();
    }

    this.styleUtils.applyStyleToElements({[childrenStyle]: ''}, this.childrenNodes);
  }

  protected willDisplay(source: HTMLElement): boolean {
    const value = this.marshal.getValue(source, 'show-hide');
    return value === true ||
      (value === undefined && this.styleUtils.lookupStyle(source, 'display') !== 'none');
  }

  protected buildChildObservable(): void {
    this.zone.runOutsideAngular(() => {
      if (typeof MutationObserver !== 'undefined') {
        this.observer = new MutationObserver((mutations: MutationRecord[]) => {
          const validatedChanges = (it: MutationRecord): boolean => {
            return (it.addedNodes && it.addedNodes.length > 0) ||
              (it.removedNodes && it.removedNodes.length > 0);
          };

          if (mutations.some(validatedChanges)) {
            this.observerSubject.next();
          }
        });
        this.observer.observe(this.nativeElement, {childList: true});
      }
    });
  }

  protected observer?: MutationObserver;
}

@Directive({selector, inputs})
export class RIDefaultLayoutGapDirective extends LayoutGapDirective {
  protected override inputs = inputs;
}

const layoutGapCacheRowRtl: Map<string, StyleDefinition> = new Map();
const layoutGapCacheColumnRtl: Map<string, StyleDefinition> = new Map();
const layoutGapCacheRowLtr: Map<string, StyleDefinition> = new Map();
const layoutGapCacheColumnLtr: Map<string, StyleDefinition> = new Map();

const GRID_SPECIFIER = ' grid';

function buildGridPadding(value: string, directionality: string): StyleDefinition {
  const [between, below] = value.split(' ');
  const bottom = below ?? between;
  let paddingRight = '0px', paddingBottom = bottom, paddingLeft = '0px';

  if (directionality === 'rtl') {
    paddingLeft = between;
  } else {
    paddingRight = between;
  }

  return {'padding': `0px ${paddingRight} ${paddingBottom} ${paddingLeft}`};
}

function buildGridMargin(value: string, directionality: string): StyleDefinition {
  const [between, below] = value.split(' ');
  const bottom = below ?? between;
  const minus = (str: string) => `-${str}`;
  let marginRight = '0px', marginBottom = minus(bottom), marginLeft = '0px';

  if (directionality === 'rtl') {
    marginLeft = minus(between);
  } else {
    marginRight = minus(between);
  }

  return {'margin': `0px ${marginRight} ${marginBottom} ${marginLeft}`};
}

function getMarginType(directionality: string, layout: string) {
  switch (layout) {
    case 'column':
      return 'margin-bottom';
    case 'column-reverse':
      return 'margin-top';
    case 'row':
      return directionality === 'rtl' ? 'margin-left' : 'margin-right';
    case 'row-reverse':
      return directionality === 'rtl' ? 'margin-right' : 'margin-left';
    default :
      return directionality === 'rtl' ? 'margin-left' : 'margin-right';
  }
}

function buildGapCSS(gapValue: string,
                     parent: {directionality: string, layout: string}): StyleDefinition {
  const key = getMarginType(parent.directionality, parent.layout);
  const margins: {[key: string]: string | null} = {...CLEAR_MARGIN_CSS};
  margins[key] = gapValue;
  return margins;
}
