import { Directive, HostBinding, HostListener } from '@angular/core';
// import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  // Apply the open class when isOpen is true
  @HostBinding('class.open') isOpen = false;

  // When the dropdown is clicked, reverse the value of isOpen
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    // constructor(private elRef: ElementRef, private renderer: Renderer2) {}
    // // If the dropdown is already open
    // if (this.elRef.nativeElement.classList.contains('open'))
    //   this.renderer.removeClass(this.elRef.nativeElement, 'open');
    // // If the dropdown is closed
    // else this.renderer.addClass(this.elRef.nativeElement, 'open');
  }
}

// Close dropdown when clicking anywhere on the page
// import {
//   Directive,
//   ElementRef,
//   HostBinding,
//   HostListener,
// } from '@angular/core';
// @Directive({
//   selector: '[appDropdown]',
// })
// export class DropdownDirective {
//   @HostBinding('class.open') isOpen = false;
//   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
//     // If the element that was clicked on is within the element that has the directive applied to it, then toggle isOpen
//     // If the element that was clicked on is outside of the element that has the directive applied to it, then close the dropdown
//     this.isOpen = this.elRef.nativeElement.contains(event.target)
//       ? !this.isOpen
//       : false;
//     console.log(event.target);
//   }
//   constructor(private elRef: ElementRef) {}
// }
