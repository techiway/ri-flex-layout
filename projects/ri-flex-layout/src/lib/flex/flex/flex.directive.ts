import { Directive, ElementRef, Inject, Injectable, Input, OnInit } from '@angular/core';
import { BaseDirective, 
  ElementMatcher, 
  LAYOUT_CONFIG, 
  LayoutConfigOptions, 
  MediaMarshaller, StyleDefinition, StyleGenerator, 
  StyleUtilsService, 
  validateBasis,
} from 'ri-flex-layout/src/lib/core';
import { isFlowHorizontal, extendObject } from 'ri-flex-layout/src/lib/_private-utils';
import { takeUntil } from 'rxjs';


interface FlexBuilderParent {
  direction: string;
  hasWrap: boolean;
}

@Injectable({providedIn: 'root'})
export class FlexStyleBuilder extends StyleGenerator {
  constructor(@Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions) {
    super();
  }
  buildStyles(input: string, parent: FlexBuilderParent) {
    let [grow, shrink, ...basisParts]: (string|number)[] = input.split(' ');
    let basis = basisParts.join(' ');

    // The flex-direction of this element's flex container. Defaults to 'row'.
    const direction = (parent.direction.indexOf('column') > -1) ? 'column' : 'row';

    const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
    const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';

    const hasCalc = String(basis).indexOf('calc') > -1;
    const usingCalc = hasCalc || (basis === 'auto');
    const isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
    const hasUnits = String(basis).indexOf('px') > -1 || String(basis).indexOf('rem') > -1 ||
      String(basis).indexOf('em') > -1 || String(basis).indexOf('vw') > -1 ||
      String(basis).indexOf('vh') > -1;

    let isValue = (hasCalc || hasUnits);

    grow = (grow == '0') ? 0 : grow;
    shrink = (shrink == '0') ? 0 : shrink;

    const isFixed = !grow && !shrink;

    let css: {[key: string]: string | number | null} = {};

    const clearStyles = {
      'max-width': null,
      'max-height': null,
      'min-width': null,
      'min-height': null
    };
    switch (basis || '') {
      case '':
        const useColumnBasisZero = this.layoutConfig.useColumnBasisZero !== false;
        basis = direction === 'row' ? '0%' : (useColumnBasisZero ? '0.000000001px' : 'auto');
        break;
      case 'initial':   // default
      case 'nogrow':
        grow = 0;
        basis = 'auto';
        break;
      case 'grow':
        basis = '100%';
        break;
      case 'noshrink':
        shrink = 0;
        basis = 'auto';
        break;
      case 'auto':
        break;
      case 'none':
        grow = 0;
        shrink = 0;
        basis = 'auto';
        break;
      default:
        if (!isValue && !isPercent && !isNaN(basis as any)) {
          basis = basis + '%';
        }

        if (basis === '0%') {
          isValue = true;
        }

        if (basis === '0px') {
          basis = '0%';
        }

        if (hasCalc) {
          css = extendObject(clearStyles, {
            'flex-grow': grow,
            'flex-shrink': shrink,
            'flex-basis': isValue ? basis : '100%'
          });
        } else {
          css = extendObject(clearStyles, {
            'flex': `${grow} ${shrink} ${isValue ? basis : '100%'}`
          });
        }

        break;
    }

    if (!(css['flex'] || css['flex-grow'])) {
      if (hasCalc) {
        css = extendObject(clearStyles, {
          'flex-grow': grow,
          'flex-shrink': shrink,
          'flex-basis': basis
        });
      } else {
        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${basis}`
        });
      }
    }

    if (basis !== '0%' && basis !== '0px' && basis !== '0.000000001px' && basis !== 'auto') {
      css[min] = isFixed || (isValue && grow) ? basis : null;
      css[max] = isFixed || (!usingCalc && shrink) ? basis : null;
    }

    if (!css[min] && !css[max]) {
      if (hasCalc) {
        css = extendObject(clearStyles, {
          'flex-grow': grow,
          'flex-shrink': shrink,
          'flex-basis': basis
        });
      } else {
        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${basis}`
        });
      }
    } else {
      if (parent.hasWrap) {
        css[hasCalc ? 'flex-basis' : 'flex'] = css[max] ?
          (hasCalc ? css[max] : `${grow} ${shrink} ${css[max]}`) :
          (hasCalc ? css[min] : `${grow} ${shrink} ${css[min]}`);
      }
    }

    return extendObject(css, {'box-sizing': 'border-box'}) as StyleDefinition;
  }
}

const inputs = [
  'riFxFlex', 'riFxFlex.xs', 'riFxFlex.sm', 'riFxFlex.md',
  'riFxFlex.lg', 'riFxFlex.xl', 'riFxFlex.lt-sm', 'riFxFlex.lt-md',
  'riFxFlex.lt-lg', 'riFxFlex.lt-xl', 'riFxFlex.gt-xs', 'riFxFlex.gt-sm',
  'riFxFlex.gt-md', 'riFxFlex.gt-lg'
];
const selector = `
  [riFxFlex], [riFxFlex.xs], [riFxFlex.sm], [riFxFlex.md],
  [riFxFlex.lg], [riFxFlex.xl], [riFxFlex.lt-sm], [riFxFlex.lt-md],
  [riFxFlex.lt-lg], [riFxFlex.lt-xl], [riFxFlex.gt-xs], [riFxFlex.gt-sm],
  [riFxFlex.gt-md], [riFxFlex.gt-lg]
`;



@Directive()
export class FlexDirective extends BaseDirective implements OnInit {

  public override RI_DIRECTIVE_KEY = 'flex';
  protected direction?: string = undefined;
  protected wrap?: boolean = undefined;
  @Input('riFxShrink')
  get shrink(): string { return this.flexShrink; }
  set shrink(value: string) {
    this.flexShrink = value || '1';
    this.triggerReflow();
  }

  @Input('riFxGrow')
  get grow(): string { return this.flexGrow; }
  set grow(value: string) {
    this.flexGrow = value || '1';
    this.triggerReflow();
  }

  protected flexGrow = '1';
  protected flexShrink = '1';

  
  constructor(elRef: ElementRef,
    styleUtils: StyleUtilsService,
    @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
    styleBuilder: FlexStyleBuilder,
    protected override marshal: MediaMarshaller) {
super(elRef, styleBuilder, styleUtils, marshal);
this.init();
}

ngOnInit() {
if (this.parentElement) {
this.marshal.trackValue(this.parentElement, 'layout')
.pipe(takeUntil(this.destroySubject))
.subscribe(this.onLayoutChange.bind(this));
this.marshal.trackValue(this.nativeElement, 'layout-align')
.pipe(takeUntil(this.destroySubject))
.subscribe(this.triggerReflow.bind(this));
}
}


protected onLayoutChange(matcher: ElementMatcher) {
const layout: string = matcher.value;
const layoutParts = layout.split(' ');
this.direction = layoutParts[0];
this.wrap = layoutParts[1] !== undefined && layoutParts[1] === 'wrap';
this.triggerUpdate();
}

protected override updateWithValue(value: string) {
const addFlexToParent = this.layoutConfig.addFlexToParent !== false;
if (this.direction === undefined) {
this.direction = this.getFlexFlowDirection(this.parentElement!, addFlexToParent);
}
if (this.wrap === undefined) {
this.wrap = this.hasWrap(this.parentElement!);
}
const direction = this.direction;
const isHorizontal = direction.startsWith('row');
const hasWrap = this.wrap;
if (isHorizontal && hasWrap) {
this.styleCache = flexRowWrapCache;
} else if (isHorizontal && !hasWrap) {
this.styleCache = flexRowCache;
} else if (!isHorizontal && hasWrap) {
this.styleCache = flexColumnWrapCache;
} else if (!isHorizontal && !hasWrap) {
this.styleCache = flexColumnCache;
}
const basis = String(value).replace(';', '');
const parts = validateBasis(basis, this.flexGrow, this.flexShrink);
this.addStyles(parts.join(' '), {direction, hasWrap});
}

protected triggerReflow() {
const activatedValue = this.activatedValue;
if (activatedValue !== undefined) {
const parts = validateBasis(activatedValue + '', this.flexGrow, this.flexShrink);
this.marshal.updateElement(this.nativeElement, this.RI_DIRECTIVE_KEY, parts.join(' '));
}
}
}

@Directive({inputs, selector})
export class RIDefaultFlexDirective extends FlexDirective {
protected override inputs = inputs;
}

const flexRowCache: Map<string, StyleDefinition> = new Map();
const flexColumnCache: Map<string, StyleDefinition> = new Map();
const flexRowWrapCache: Map<string, StyleDefinition> = new Map();
const flexColumnWrapCache: Map<string, StyleDefinition> = new Map();