import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  collapsed = true;

  constructor(private dataStorageService: DataStorageService) {}

  // Store data
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  // Retrieve data
  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
