import {
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
  Injectable,
  AfterViewInit,
} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  BaseDirective,
  LAYOUT_CONFIG,
  LayoutConfigOptions,
  MediaMarshaller,
  SERVER_TOKEN,
  StyleUtilsService,
  StyleGenerator,
} from 'ri-flex-layout/src/lib/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {takeUntil} from 'rxjs/operators';

export interface ShowHideParent {
  display: string;
  isServer: boolean;
}

@Injectable({providedIn: 'root'})
export class ShowHideStyleBuilder extends StyleGenerator {
  buildStyles(show: string, parent: ShowHideParent) {
    const shouldShow = show === 'true';
    return {'display': shouldShow ? parent.display || (parent.isServer ? 'initial' : '') : 'none'};
  }
}

@Directive()
export class ShowHideDirective extends BaseDirective implements AfterViewInit, OnChanges {
  protected override RI_DIRECTIVE_KEY = 'show-hide';

  /** Original DOM Element CSS display style */
  protected display: string = '';
  protected hasLayout = false;
  protected hasFlexChild = false;

  constructor(elementRef: ElementRef,
              styleBuilder: ShowHideStyleBuilder,
              styler: StyleUtilsService,
              marshal: MediaMarshaller,
              @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Inject(SERVER_TOKEN) protected serverModuleLoaded: boolean) {
    super(elementRef, styleBuilder, styler, marshal);
  }

  ngAfterViewInit() {
    this.trackExtraTriggers();

    const children = Array.from(this.nativeElement.children);
    for (let i = 0; i < children.length; i++) {
      if (this.marshal.hasValue(children[i] as HTMLElement, 'flex')) {
        this.hasFlexChild = true;
        break;
      }
    }

    if (DISPLAY_MAP.has(this.nativeElement)) {
      this.display = DISPLAY_MAP.get(this.nativeElement)!;
    } else {
      this.display = this.getDisplayStyle();
      DISPLAY_MAP.set(this.nativeElement, this.display);
    }

    this.init();
    const defaultValue = this.marshal.getValue(this.nativeElement, this.RI_DIRECTIVE_KEY, '');
    if (defaultValue === undefined || defaultValue === '') {
      this.setValue(true, '');
    } else {
      this.triggerUpdate();
    }
  }

  override ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach(key => {
      if (this.inputs.indexOf(key) !== -1) {
        const inputKey = key.split('.');
        const bp = inputKey.slice(1).join('.');
        const inputValue = changes[key].currentValue;
        let shouldShow = inputValue !== '' ?
            inputValue !== 0 ? coerceBooleanProperty(inputValue) : false
            : true;
        if (inputKey[0] === 'riFxHide') {
          shouldShow = !shouldShow;
        }
        this.setValue(shouldShow, bp);
      }
    });
  }


  protected trackExtraTriggers() {
    this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');

    ['layout', 'layout-align'].forEach(key => {
      this.marshal
          .trackValue(this.nativeElement, key)
          .pipe(takeUntil(this.destroySubject))
          .subscribe(this.triggerUpdate.bind(this));
    });
  }


  protected getDisplayStyle(): string {
    return (this.hasLayout || (this.hasFlexChild && this.layoutConfig.addFlexToParent)) ?
        'flex' : this.styler.lookupStyle(this.nativeElement, 'display', true);
  }

  protected override updateWithValue(value: boolean | string = true) {
    if (value === '') {
      return;
    }
    const isServer = isPlatformServer(this.platformId);
    this.addStyles(value ? 'true' : 'false', {display: this.display, isServer});
    if (isServer && this.serverModuleLoaded) {
      this.nativeElement.style.setProperty('display', '');
    }
    this.marshal.triggerUpdate(this.parentElement!, 'layout-gap');
  }
}

const DISPLAY_MAP: WeakMap<HTMLElement, string> = new WeakMap();

const inputs = [
  'riFxShow', 'riFxShow.print',
  'riFxShow.xs', 'riFxShow.sm', 'riFxShow.md', 'riFxShow.lg', 'riFxShow.xl',
  'riFxShow.lt-sm', 'riFxShow.lt-md', 'riFxShow.lt-lg', 'riFxShow.lt-xl',
  'riFxShow.gt-xs', 'riFxShow.gt-sm', 'riFxShow.gt-md', 'riFxShow.gt-lg',
  'riFxHide', 'riFxHide.print',
  'riFxHide.xs', 'riFxHide.sm', 'riFxHide.md', 'riFxHide.lg', 'riFxHide.xl',
  'riFxHide.lt-sm', 'riFxHide.lt-md', 'riFxHide.lt-lg', 'riFxHide.lt-xl',
  'riFxHide.gt-xs', 'riFxHide.gt-sm', 'riFxHide.gt-md', 'riFxHide.gt-lg'
];

const selector = `
  [riFxShow], [riFxShow.print],
  [riFxShow.xs], [riFxShow.sm], [riFxShow.md], [riFxShow.lg], [riFxShow.xl],
  [riFxShow.lt-sm], [riFxShow.lt-md], [riFxShow.lt-lg], [riFxShow.lt-xl],
  [riFxShow.gt-xs], [riFxShow.gt-sm], [riFxShow.gt-md], [riFxShow.gt-lg],
  [riFxHide], [riFxHide.print],
  [riFxHide.xs], [riFxHide.sm], [riFxHide.md], [riFxHide.lg], [riFxHide.xl],
  [riFxHide.lt-sm], [riFxHide.lt-md], [riFxHide.lt-lg], [riFxHide.lt-xl],
  [riFxHide.gt-xs], [riFxHide.gt-sm], [riFxHide.gt-md], [riFxHide.gt-lg]
`;

/**
 * 'show' Layout API directive
 */
@Directive({selector, inputs})
export class RIDefaultShowHideDirective extends ShowHideDirective {
  protected override inputs = inputs;
}
