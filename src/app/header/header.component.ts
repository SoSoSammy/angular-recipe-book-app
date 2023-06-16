import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>(); // Just need type to be string, not object
  collapsed = true;

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
}
