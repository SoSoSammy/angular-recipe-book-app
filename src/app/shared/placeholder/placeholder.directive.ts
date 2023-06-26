import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]', // camelCase is convention for naming directives
})
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
