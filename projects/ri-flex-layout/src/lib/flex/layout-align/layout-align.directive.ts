import { Directive, ElementRef, Injectable } from '@angular/core';
import { BaseDirective, ElementMatcher, MediaMarshaller, StyleDefinition, 
  StyleGenerator, StyleUtilsService } from 'ri-flex-layout/src/lib/core';
import { takeUntil } from 'rxjs';
import { extendObject, isFlowHorizontal, LAYOUT_VALUES } from 'ri-flex-layout/src/lib/_private-utils';

export interface LayoutAlignParent {
  layout: string;
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class LayoutAlignStyleBuilder extends StyleGenerator {
  buildStyles(align: string, parent: LayoutAlignParent) {
    const css: StyleDefinition = {}, [mainAxis, crossAxis] = align.split(' ');

    // Main axis
    switch (mainAxis) {
      case 'center':
        css['justify-content'] = 'center';
        break;
      case 'space-around':
        css['justify-content'] = 'space-around';
        break;
      case 'space-between':
        css['justify-content'] = 'space-between';
        break;
      case 'space-evenly':
        css['justify-content'] = 'space-evenly';
        break;
      case 'end':
      case 'flex-end':
        css['justify-content'] = 'flex-end';
        break;
      case 'start':
      case 'flex-start':
      default :
        css['justify-content'] = 'flex-start';  // default main axis
        break;
    }

    // Cross-axis
    switch (crossAxis) {
      case 'start':
      case 'flex-start':
        css['align-items'] = css['align-content'] = 'flex-start';
        break;
      case 'center':
        css['align-items'] = css['align-content'] = 'center';
        break;
      case 'end':
      case 'flex-end':
        css['align-items'] = css['align-content'] = 'flex-end';
        break;
      case 'space-between':
        css['align-content'] = 'space-between';
        css['align-items'] = 'stretch';
        break;
      case 'space-around':
        css['align-content'] = 'space-around';
        css['align-items'] = 'stretch';
        break;
      case 'baseline':
        css['align-content'] = 'stretch';
        css['align-items'] = 'baseline';
        break;
      case 'stretch':
      default : // 'stretch'
        css['align-items'] = css['align-content'] = 'stretch';   // default cross axis
        break;
    }

    return extendObject(css, {
      'display' : parent.inline ? 'inline-flex' : 'flex',
      'flex-direction' : parent.layout,
      'box-sizing' : 'border-box',
      'max-width': crossAxis === 'stretch' ?
        !isFlowHorizontal(parent.layout) ? '100%' : null : null,
      'max-height': crossAxis === 'stretch' ?
        isFlowHorizontal(parent.layout) ? '100%' : null : null,
    }) as StyleDefinition;
  }
}

const inputs = [
  'riFxLayoutAlign', 'riFxLayoutAlign.xs', 'riFxLayoutAlign.sm', 'riFxLayoutAlign.md',
  'riFxLayoutAlign.lg', 'riFxLayoutAlign.xl', 'riFxLayoutAlign.lt-sm', 'riFxLayoutAlign.lt-md',
  'riFxLayoutAlign.lt-lg', 'riFxLayoutAlign.lt-xl', 'riFxLayoutAlign.gt-xs', 'riFxLayoutAlign.gt-sm',
  'riFxLayoutAlign.gt-md', 'riFxLayoutAlign.gt-lg'
];
const selector = `
  [riFxLayoutAlign], [riFxLayoutAlign.xs], [riFxLayoutAlign.sm], [riFxLayoutAlign.md],
  [riFxLayoutAlign.lg], [riFxLayoutAlign.xl], [riFxLayoutAlign.lt-sm], [riFxLayoutAlign.lt-md],
  [riFxLayoutAlign.lt-lg], [riFxLayoutAlign.lt-xl], [riFxLayoutAlign.gt-xs], [riFxLayoutAlign.gt-sm],
  [riFxLayoutAlign.gt-md], [riFxLayoutAlign.gt-lg]
`;

@Directive()
export class LayoutAlignDirective extends BaseDirective {
  protected override RI_DIRECTIVE_KEY = 'layout-align';
  protected layout = 'row';  // default flex-direction
  protected inline = false;  // default inline value

  constructor(elRef: ElementRef,
              styleUtils: StyleUtilsService,
              styleBuilder: LayoutAlignStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
    this.marshal.trackValue(this.nativeElement, 'layout')
      .pipe(takeUntil(this.destroySubject))
      .subscribe(this.onLayoutChange.bind(this));
  }

  protected override updateWithValue(value: string) {
    const layout = this.layout || 'row';
    const inline = this.inline;
    if (layout === 'row' && inline) {
      this.styleCache = layoutAlignHorizontalInlineCache;
    } else if (layout === 'row' && !inline) {
      this.styleCache = layoutAlignHorizontalCache;
    } else if (layout === 'row-reverse' && inline) {
      this.styleCache = layoutAlignHorizontalRevInlineCache;
    } else if (layout === 'row-reverse' && !inline) {
      this.styleCache = layoutAlignHorizontalRevCache;
    } else if (layout === 'column' && inline) {
      this.styleCache = layoutAlignVerticalInlineCache;
    } else if (layout === 'column' && !inline) {
      this.styleCache = layoutAlignVerticalCache;
    } else if (layout === 'column-reverse' && inline) {
      this.styleCache = layoutAlignVerticalRevInlineCache;
    } else if (layout === 'column-reverse' && !inline) {
      this.styleCache = layoutAlignVerticalRevCache;
    }
    this.addStyles(value, {layout, inline});
  }

  protected onLayoutChange(matcher: ElementMatcher) {
    const layoutKeys: string[] = matcher.value.split(' ');
    this.layout = layoutKeys[0];
    this.inline = matcher.value.includes('inline');
    if (!LAYOUT_VALUES.find(x => x === this.layout)) {
      this.layout = 'row';
    }
    this.triggerUpdate();
  }
}

@Directive({selector, inputs})
export class RIDefaultLayoutAlignDirective extends LayoutAlignDirective {
  protected override inputs = inputs;
}

const layoutAlignHorizontalCache: Map<string, StyleDefinition> = new Map();
const layoutAlignVerticalCache: Map<string, StyleDefinition> = new Map();
const layoutAlignHorizontalRevCache: Map<string, StyleDefinition> = new Map();
const layoutAlignVerticalRevCache: Map<string, StyleDefinition> = new Map();
const layoutAlignHorizontalInlineCache: Map<string, StyleDefinition> = new Map();
const layoutAlignVerticalInlineCache: Map<string, StyleDefinition> = new Map();
const layoutAlignHorizontalRevInlineCache: Map<string, StyleDefinition> = new Map();
const layoutAlignVerticalRevInlineCache: Map<string, StyleDefinition> = new Map();

