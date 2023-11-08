# RiFlexLayout

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0.

This is alternative for Angular Flex layout (Supports Latest angular version).

### Getting Started


Start by installing the RI Flex library from `npm`

`ng add @angular/cdk`

`npm i ri-flex-layout`

Next, you'll need to import the RI Flex module in your app's module.

**app.module.ts**

```ts

import { RiFlexLayoutModule } from 'ri-flex-layout';
...

@NgModule({
    ...
    imports: [ RiFlexLayoutModule ],
    ...
});
```

After that is configured, you can use the Angular Layout attributes in your HTML tags for flex layout:
```html
<div riFxLayout="row" riFxLayoutAlign="space-between center" riFxLayoutGap="10px">
    <div riFxFlex="40">Sample div</div>
    <div riFxFlex>Test div</div>
</div>
```
Example Column layout code 
```html
<div riFxLayout="column" riFxLayoutAlign="space-around center" riFxLayoutGap="10px">
    <div riFxFlex="50">Coloumn 1</div>
    <div riFxFlex>Coloumn 2</div>
</div>
```

Responsive 

```html
<div riFxLayout="row wrap" riFxLayout.xs="column" riFxLayoutAlign="space-between" riFxLayoutGap="10px" riFxLayoutGap.xs="10px">
      <div riFxFlex="33" riFxFlex.xs="100">Sample Div1</div>
      <div riFxFlex="33" riFxFlex.xs="100">Sample Div2</div>
      <div riFxFlex="33" riFxFlex.xs="100">Sample Div3</div>
</div>
```

## License

MIT

---



