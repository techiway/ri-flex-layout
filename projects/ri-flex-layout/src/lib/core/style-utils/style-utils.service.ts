import {StylesheetMap} from '../stylesheet-map/stylesheet-map';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import { LAYOUT_CONFIG, LayoutConfigOptions } from '../tokens/library-config';
import { SERVER_TOKEN } from '../tokens';
import { applyCssPrefixes } from 'ri-flex-layout/src/lib/_private-utils';


@Injectable({providedIn: 'root'})
export class StyleUtilsService {

    constructor(private _serverStylesheet: StylesheetMap,
        @Inject(SERVER_TOKEN) private _serverModuleLoaded: boolean,
        @Inject(PLATFORM_ID) private _platformId: Object,
        @Inject(LAYOUT_CONFIG) private layoutConfig: LayoutConfigOptions) {}

/**
 * Method for apply style to element
 * @param  {HTMLElement} element 
 * @param  {(StyleDefinition | string)} style 
 * @param  {(string | number | null)} [value=null] 
 * @return {void}@memberof StyleUtilsService
 */
public applyStyleToElement(element: HTMLElement,
                style: StyleDefinition | string,
                value: string | number | null = null): void {
let styles: StyleDefinition = {};
if (typeof style === 'string') {
styles[style] = value;
style = styles;
}
styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
this._applyMultiValueStyleToElement(styles, element);
}

/**
 * Method for apply style to child elements
 * @param  {StyleDefinition} style 
 * @param  {HTMLElement[]} [elements=[]] 
 * @return {void}@memberof StyleUtilsService
 */
public applyStyleToElements(style: StyleDefinition, elements: HTMLElement[] = []): void {
const styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
elements.forEach(el => {
this._applyMultiValueStyleToElement(styles, el);
});
}

/**
 * Method for get flow direction row | column
 * @param  {HTMLElement} target 
 * @return [string, string] 
 * @memberof StyleUtilsService
 */
public getFlowDirection(target: HTMLElement): [string, string] {
const query = 'flex-direction';
let value = this.lookupStyle(target, query);
const hasInlineValue = this.lookupInlineStyle(target, query) ||
(isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';

return [value || 'row', hasInlineValue];
}

/**
 * Method for check wrap is present or not
 * @param  {HTMLElement} target 
 * @return boolean 
 * @memberof StyleUtilsService
 */
public hasWrap(target: HTMLElement): boolean {
const query = 'flex-wrap';
return this.lookupStyle(target, query) === 'wrap';
}

/**
 * Method for check attribute is present or not
 * @param  {HTMLElement} element 
 * @param  {string} attribute 
 * @return string 
 * @memberof StyleUtilsService
 */
public lookupAttributeValue(element: HTMLElement, attribute: string): string {
return element.getAttribute(attribute) ?? '';
}
/**
 * Method for check inline style is present or not
 * @param  {HTMLElement} element 
 * @param  {string} styleName 
 * @return string 
 * @memberof StyleUtilsService
 */
public lookupInlineStyle(element: HTMLElement, styleName: string): string {
return isPlatformBrowser(this._platformId) ?
element.style.getPropertyValue(styleName) : getServerStyle(element, styleName);
}

/**
 * Method for check style is present or not
 * @param  {HTMLElement} element 
 * @param  {string} styleName 
 * @param  {boolean} [inlineOnly=false] 
 * @return string 
 * @memberof StyleUtilsService
 */
public lookupStyle(element: HTMLElement, styleName: string, inlineOnly = false): string {
let value = '';
if (element) {
let immediateValue = value = this.lookupInlineStyle(element, styleName);
if (!immediateValue) {
  if (isPlatformBrowser(this._platformId)) {
    if (!inlineOnly) {
      value = getComputedStyle(element).getPropertyValue(styleName);
    }
  } else {
    if (this._serverModuleLoaded) {
      value = this._serverStylesheet.getStyleForElement(element, styleName);
    }
  }
}
}

return value ? value.trim() : '';
}

/**
 * Method for apply syles to element
 * @private
 * @param  {StyleDefinition} styles 
 * @param  {HTMLElement} element 
 * @return {void}@memberof StyleUtilsService
 */
private _applyMultiValueStyleToElement(styles: StyleDefinition,
                                   element: HTMLElement): void {
Object.keys(styles).sort().forEach(key => {
const el = styles[key];
const values: (string | number | null)[] = Array.isArray(el) ? el : [el];
values.sort();
for (let value of values) {
  value = value ? value + '' : '';
  if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
    isPlatformBrowser(this._platformId) ?
      element.style.setProperty(key, value) : setServerStyle(element, key, value);
  } else {
    this._serverStylesheet.addStyleToElement(element, key, value);
  }
}
});
}
}
/**
 * Method for get style from server
 * @param  {*} element 
 * @param  {string} styleName 
 * @return string 
 */
function getServerStyle(element: any, styleName: string): string {
const styleMap = readStyleAttribute(element);
return styleMap[styleName] ?? '';
}

/**
 * Method for set server style
 * @param  {*} element 
 * @param  {string} styleName 
 * @param  {(string|null)} [styleValue] 
 * @return {void}
 */
function setServerStyle(element: any, styleName: string, styleValue?: string|null): void {
styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const styleMap = readStyleAttribute(element);
styleMap[styleName] = styleValue ?? '';
writeStyleAttribute(element, styleMap);
}

/**
 * Method for write style attribute
 * @param  {*} element 
 * @param  {{[name: string]: string}} styleMap 
 * @return {void}
 */
function writeStyleAttribute(element: any, styleMap: {[name: string]: string}) {
let styleAttrValue = '';
for (const key in styleMap) {
const newValue = styleMap[key];
if (newValue) {
styleAttrValue += `${key}:${styleMap[key]};`;
}
}
element.setAttribute('style', styleAttrValue);
}

/**
 * Method for read styles to attribute
 * @param  {*} element 
 * @return {[name: string]: string} 
 */
function readStyleAttribute(element: any): {[name: string]: string} {
const styleMap: {[name: string]: string} = {};
const styleAttribute = element.getAttribute('style');
if (styleAttribute) {
const styleList = styleAttribute.split(/;+/g);
for (let i = 0; i < styleList.length; i++) {
const style = styleList[i].trim();
if (style.length > 0) {
  const colonIndex = style.indexOf(':');
  if (colonIndex === -1) {
    throw new Error(`Invalid CSS style: ${style}`);
  }
  const name = style.substr(0, colonIndex).trim();
  styleMap[name] = style.substr(colonIndex + 1).trim();
}
}
}
return styleMap;
}


export type StyleDefinition = { [property: string]: string | number | null };
